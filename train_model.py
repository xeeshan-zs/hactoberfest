"""Fast, robust training script for AI Image Detector.

Processes balanced real and fake images from `data-set/archive.zip`,
extracts 70-dimensional multi-spectral FFT features, and trains
a high-accuracy ExtraTrees / RandomForest classifier pipeline.
"""

import os
import io
import time
import zipfile
import random
import numpy as np
from PIL import Image
import joblib
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.metrics import classification_report, accuracy_score, roc_auc_score


def extract_features_from_img(img: Image.Image) -> np.ndarray:
    """Extracts 70-dim multi-spectral FFT features from PIL Image."""
    try:
        rgb_img = img.convert("RGB").resize((256, 256), Image.Resampling.BILINEAR)
        rgb_arr = np.asarray(rgb_img, dtype=np.float32)

        # 1. Grayscale 2D FFT
        gray = 0.2989 * rgb_arr[:, :, 0] + 0.5870 * rgb_arr[:, :, 1] + 0.1140 * rgb_arr[:, :, 2]
        f_gray = np.fft.fft2(gray)
        fshift_gray = np.fft.fftshift(f_gray)
        mag_gray = np.abs(fshift_gray)
        log_mag = np.log1p(mag_gray)

        # 2. 1D Azimuthal Radial Profile (48 bins)
        cy, cx = 128, 128
        y, x = np.ogrid[:256, :256]
        r = np.hypot(x - cx, y - cy)
        max_r = 128
        num_bins = 48
        bins = np.linspace(1, max_r, num_bins + 1)
        radial_vals = []
        radii = []

        for i in range(num_bins):
            mask = (r >= bins[i]) & (r < bins[i + 1])
            if np.any(mask):
                val = float(np.mean(log_mag[mask]))
            else:
                val = 0.0
            radial_vals.append(val)
            radii.append(float((bins[i] + bins[i + 1]) / 2.0))

        rad_arr = np.array(radial_vals, dtype=np.float32)
        norm_rad = (rad_arr - np.min(rad_arr)) / (np.max(rad_arr) - np.min(rad_arr) + 1e-8)

        # 3. Spectral Alpha Slope
        radii_arr = np.array(radii)
        valid = (radii_arr > 3) & (radii_arr < max_r * 0.85)
        if np.sum(valid) > 5:
            poly = np.polyfit(np.log(radii_arr[valid]), np.log(rad_arr[valid] + 1e-8), 1)
            alpha_slope = -float(poly[0])
        else:
            alpha_slope = 1.8

        # 4. High/Low Frequency Ratio
        hf_energy = float(np.mean(norm_rad[int(num_bins * 0.65):]))
        lf_energy = float(np.mean(norm_rad[:int(num_bins * 0.35)]))
        hf_ratio = hf_energy / (lf_energy + 1e-8)

        # 5. Multi-channel Chromatic Coherence (VAE Decoder Artifact)
        ch_mags = []
        for c in range(3):
            f_c = np.fft.fft2(rgb_arr[:, :, c])
            ch_mags.append(np.abs(np.fft.fftshift(f_c)))

        hp_mask = r > (max_r * 0.5)
        r_hf = ch_mags[0][hp_mask].flatten()
        g_hf = ch_mags[1][hp_mask].flatten()
        b_hf = ch_mags[2][hp_mask].flatten()

        rg_corr = float(np.corrcoef(r_hf, g_hf)[0, 1]) if len(r_hf) > 10 else 0.5
        rb_corr = float(np.corrcoef(r_hf, b_hf)[0, 1]) if len(r_hf) > 10 else 0.5
        gb_corr = float(np.corrcoef(g_hf, b_hf)[0, 1]) if len(g_hf) > 10 else 0.5

        # 6. Spectral Entropy
        flat_mag = mag_gray.flatten()
        prob_dist = flat_mag / (np.sum(flat_mag) + 1e-12)
        prob_dist = prob_dist[prob_dist > 0]
        entropy = float(-np.sum(prob_dist * np.log2(prob_dist)))

        # 7. High-Pass Laplacian Residual
        laplacian = (
            rgb_arr[:-2, 1:-1, :] + rgb_arr[2:, 1:-1, :] +
            rgb_arr[1:-1, :-2, :] + rgb_arr[1:-1, 2:, :] -
            4 * rgb_arr[1:-1, 1:-1, :]
        )
        noise_var = float(np.mean(np.var(laplacian, axis=(0, 1))))

        extra_features = [
            alpha_slope,
            hf_ratio,
            rg_corr,
            rb_corr,
            gb_corr,
            (rg_corr + rb_corr + gb_corr) / 3.0,
            entropy,
            noise_var,
            float(np.std(norm_rad)),
            float(np.mean(norm_rad[int(num_bins * 0.85):])),
            float(np.max(norm_rad) - np.min(norm_rad)),
            float(np.percentile(norm_rad, 90)),
            float(np.percentile(norm_rad, 10)),
            float(np.mean(norm_rad[10:25])),
            float(np.std(norm_rad[int(num_bins * 0.65):])),
            float(np.sum(norm_rad > 0.6)),
            float(np.median(norm_rad)),
            float(np.var(ch_mags[0] - ch_mags[1])),
            float(np.var(ch_mags[0] - ch_mags[2])),
            float(np.var(ch_mags[1] - ch_mags[2])),
            float(np.sum(norm_rad[:10])),
            float(np.sum(norm_rad[-10:])),
        ]

        feature_vector = np.concatenate([norm_rad, np.array(extra_features, dtype=np.float32)])
        return np.nan_to_num(feature_vector, nan=0.0, posinf=1.0, neginf=0.0)
    except Exception:
        return np.zeros(70, dtype=np.float32)


def main():
    zip_path = "data-set/archive.zip"
    if not os.path.exists(zip_path):
        print(f"Error: {zip_path} not found.", flush=True)
        return

    print("Opening dataset archive...", flush=True)
    z = zipfile.ZipFile(zip_path, "r")
    all_files = z.namelist()

    train_real_all = [f for f in all_files if "train/real/" in f and f.endswith(".jpg")]
    train_fake_all = [f for f in all_files if "train/fake/" in f and f.endswith(".jpg")]
    test_real_all = [f for f in all_files if "test/real/" in f and f.endswith(".jpg")]
    test_fake_all = [f for f in all_files if "test/fake/" in f and f.endswith(".jpg")]

    random.seed(42)
    # Balanced 1,500 train (750 real + 750 fake) and 300 test (150 real + 150 fake)
    TRAIN_N = 800
    TEST_N = 200

    train_items = (
        [(f, 0) for f in random.sample(train_real_all, min(TRAIN_N, len(train_real_all)))] +
        [(f, 1) for f in random.sample(train_fake_all, min(TRAIN_N, len(train_fake_all)))]
    )
    test_items = (
        [(f, 0) for f in random.sample(test_real_all, min(TEST_N, len(test_real_all)))] +
        [(f, 1) for f in random.sample(test_fake_all, min(TEST_N, len(test_fake_all)))]
    )

    random.shuffle(train_items)
    random.shuffle(test_items)

    print(f"Dataset selected: {len(train_items)} train ({TRAIN_N} real, {TRAIN_N} fake), {len(test_items)} test.", flush=True)

    # Sequential in-memory extraction
    t0 = time.time()
    X_train, y_train = [], []
    for idx, (path, label) in enumerate(train_items):
        try:
            data = z.read(path)
            img = Image.open(io.BytesIO(data))
            feat = extract_features_from_img(img)
            X_train.append(feat)
            y_train.append(label)
        except Exception:
            pass
        if (idx + 1) % 200 == 0 or idx == len(train_items) - 1:
            print(f"Train extraction progress: {idx + 1}/{len(train_items)} ({time.time() - t0:.1f}s)", flush=True)

    X_test, y_test = [], []
    for idx, (path, label) in enumerate(test_items):
        try:
            data = z.read(path)
            img = Image.open(io.BytesIO(data))
            feat = extract_features_from_img(img)
            X_test.append(feat)
            y_test.append(label)
        except Exception:
            pass

    z.close()

    X_train = np.array(X_train, dtype=np.float32)
    y_train = np.array(y_train, dtype=np.int32)
    X_test = np.array(X_test, dtype=np.float32)
    y_test = np.array(y_test, dtype=np.int32)

    print(f"\nExtracted features shape: X_train {X_train.shape}, X_test {X_test.shape}", flush=True)
    print("Training ExtraTreesClassifier with StandardScaler...", flush=True)

    model = Pipeline([
        ("scaler", StandardScaler()),
        ("classifier", ExtraTreesClassifier(
            n_estimators=200,
            max_depth=16,
            min_samples_split=3,
            random_state=42,
            n_jobs=-1
        ))
    ])

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]
    acc = accuracy_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_proba)

    print("\n" + "=" * 55, flush=True)
    print(f"VALIDATION ACCURACY: {acc * 100:.2f}% | ROC-AUC: {auc:.4f}", flush=True)
    print("=" * 55, flush=True)
    print(classification_report(y_test, y_pred, target_names=["Real", "AI-Generated"]), flush=True)

    joblib.dump(model, "backend/model.pkl")
    joblib.dump(model, "ai_detector_svm.pkl")
    print("Saved trained model to backend/model.pkl and ai_detector_svm.pkl!", flush=True)


if __name__ == "__main__":
    main()
