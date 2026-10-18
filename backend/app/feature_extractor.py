"""Feature extraction and multi-spectral diagnostics module.

Provides:
1. `generate_fft_spectrum_image`: High-res 2D FFT shifted log-magnitude spectrum (base64 PNG).
2. `extract_fingerprint`: 40-dimensional multi-spectral feature vector matching the trained HistGradientBoosting model.
3. `compute_spectral_diagnostics`: Radial power decay curve and diagnostic telemetry for UI charts.
"""

import io
import base64
import numpy as np
from PIL import Image
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt


def generate_fft_spectrum_image(image: Image.Image, target_size: tuple[int, int] = (512, 512)) -> str:
    """Computes the 2D FFT log-magnitude spectrum and returns an inferno colormapped base64 PNG."""
    gray_img = image.convert("L").resize(target_size, Image.Resampling.BILINEAR)
    img_array = np.asarray(gray_img, dtype=np.float32)

    # 2D Fast Fourier Transform with zero-frequency centered
    fft_2d = np.fft.fft2(img_array)
    fft_shift = np.fft.fftshift(fft_2d)

    # Log magnitude spectrum: log(1 + |F(u, v)|)
    magnitude = np.abs(fft_shift)
    log_magnitude = np.log1p(magnitude)

    # Normalize to [0, 1]
    min_val, max_val = np.min(log_magnitude), np.max(log_magnitude)
    norm_spectrum = (log_magnitude - min_val) / (max_val - min_val + 1e-8)

    # Dark-themed high-contrast rendering
    fig, ax = plt.subplots(figsize=(6, 6), dpi=120)
    fig.patch.set_facecolor("#070A0F")
    ax.set_facecolor("#070A0F")
    ax.imshow(norm_spectrum, cmap="inferno", interpolation="nearest")
    ax.axis("off")
    plt.tight_layout(pad=0)

    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight", pad_inches=0, facecolor=fig.get_facecolor())
    plt.close(fig)
    buf.seek(0)

    base64_str = base64.b64encode(buf.read()).decode("utf-8")
    return f"data:image/png;base64,{base64_str}"


def extract_fingerprint(image: Image.Image) -> np.ndarray:
    """Extracts 40-dimensional multi-spectral feature vector matching the trained model pipeline."""
    try:
        rgb_img = image.convert("RGB").resize((256, 256), Image.Resampling.BILINEAR)
        arr = np.asarray(rgb_img, dtype=np.float32)

        # 1. Grayscale 2D FFT
        gray = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
        f_shift = np.fft.fftshift(np.fft.fft2(gray))
        mag = np.log1p(np.abs(f_shift))

        # 2. 1D Radial Profile (32 bins)
        cy, cx = 128, 128
        y, x = np.ogrid[:256, :256]
        r = np.hypot(x - cx, y - cy)
        bins = np.linspace(1, 128, 33)
        rad = np.array([np.mean(mag[(r >= bins[i]) & (r < bins[i + 1])]) for i in range(32)], dtype=np.float32)
        norm_rad = (rad - rad.min()) / (rad.max() - rad.min() + 1e-8)

        # 3. Spectral Power-Law Alpha Slope
        radii = np.array([(bins[i] + bins[i + 1]) / 2.0 for i in range(32)])
        slope = -float(np.polyfit(np.log(radii[2:25]), np.log(rad[2:25] + 1e-8), 1)[0])

        # 4. High vs Low Frequency Energy
        hf = float(np.mean(norm_rad[20:]))
        lf = float(np.mean(norm_rad[:10]))
        hf_ratio = float(hf / (lf + 1e-8))

        # 5. Multi-channel Chromatic Coherence (VAE Decoder Artifact)
        f_r = np.abs(np.fft.fftshift(np.fft.fft2(arr[:, :, 0])))
        f_g = np.abs(np.fft.fftshift(np.fft.fft2(arr[:, :, 1])))
        f_b = np.abs(np.fft.fftshift(np.fft.fft2(arr[:, :, 2])))
        hp_mask = r > 64
        r_flat = f_r[hp_mask].flatten()
        g_flat = f_g[hp_mask].flatten()
        b_flat = f_b[hp_mask].flatten()

        rg_corr = float(np.corrcoef(r_flat, g_flat)[0, 1]) if len(r_flat) > 10 else 0.5
        rb_corr = float(np.corrcoef(r_flat, b_flat)[0, 1]) if len(r_flat) > 10 else 0.5
        chromatic_mean = (rg_corr + rb_corr) / 2.0
        rad_std = float(np.std(norm_rad))

        features = np.concatenate([
            norm_rad,
            [slope, hf, lf, hf_ratio, rg_corr, rb_corr, chromatic_mean, rad_std]
        ])
        return np.nan_to_num(features, nan=0.0, posinf=1.0, neginf=0.0)
    except Exception:
        return np.zeros(40, dtype=np.float32)


def compute_spectral_diagnostics(image: Image.Image, num_bins: int = 48) -> dict:
    """Computes forensic frequency analytics and radial decay curve for charting."""
    w, h = image.size
    target_dim = 256
    gray_img = image.convert("L").resize((target_dim, target_dim), Image.Resampling.BILINEAR)
    img_array = np.asarray(gray_img, dtype=np.float32)

    fft_2d = np.fft.fft2(img_array)
    fft_shift = np.fft.fftshift(fft_2d)
    magnitude = np.abs(fft_shift)
    log_mag = np.log1p(magnitude)

    center_y, center_x = target_dim // 2, target_dim // 2
    y, x = np.ogrid[:target_dim, :target_dim]
    r = np.hypot(x - center_x, y - center_y)
    max_radius = target_dim / 2.0

    bin_edges = np.linspace(0, max_radius, num_bins + 1)
    radial_values = []
    natural_1f_curve = []

    for i in range(num_bins):
        mask = (r >= bin_edges[i]) & (r < bin_edges[i + 1])
        if np.any(mask):
            mean_val = float(np.mean(log_mag[mask]))
        else:
            mean_val = 0.0
        radial_values.append(mean_val)

        # Theoretical natural 1/f^2 optical decay
        norm_r = (i + 1) / float(num_bins)
        natural_1f_curve.append(float(1.0 / (1.0 + 4.5 * (norm_r ** 1.9))))

    max_rad = max(radial_values) if radial_values else 1.0
    min_rad = min(radial_values) if radial_values else 0.0
    norm_radial = [round((val - min_rad) / (max_rad - min_rad + 1e-8), 4) for val in radial_values]
    norm_natural = [round(val, 4) for val in natural_1f_curve]

    high_freq_slice = norm_radial[int(num_bins * 0.65):]
    hf_energy_ratio = round(float(np.mean(high_freq_slice)), 4) if high_freq_slice else 0.0

    prob_dist = magnitude.flatten() / (np.sum(magnitude) + 1e-12)
    prob_dist = prob_dist[prob_dist > 0]
    entropy_val = float(-np.sum(prob_dist * np.log2(prob_dist)))
    norm_entropy = round(min(1.0, max(0.0, entropy_val / 16.0)), 4)

    # Compute alpha slope
    radii = [float((bin_edges[i] + bin_edges[i+1]) / 2.0) for i in range(num_bins)]
    radii_arr = np.array(radii)
    rad_arr = np.array(radial_values)
    valid = (radii_arr > 3) & (radii_arr < max_radius * 0.85)
    if np.sum(valid) > 5:
        poly = np.polyfit(np.log(radii_arr[valid]), np.log(rad_arr[valid] + 1e-8), 1)
        alpha_slope = round(-float(poly[0]), 3)
    else:
        alpha_slope = 1.8

    return {
        "dimensions": [w, h],
        "radial_profile": norm_radial,
        "natural_curve": norm_natural,
        "high_freq_ratio": hf_energy_ratio,
        "spectral_entropy": norm_entropy,
        "spectral_slope_alpha": alpha_slope,
        "nyquist_bins": num_bins,
    }
