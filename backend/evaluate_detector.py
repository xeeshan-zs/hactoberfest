"""Evaluate the serving artifact on a seeded balanced test-folder sample; no training or API calls."""
import argparse
import hashlib
import io
import json
import random
import time
import zipfile
from pathlib import Path

import joblib
import numpy as np
import sklearn
from PIL import Image
from sklearn.metrics import accuracy_score, balanced_accuracy_score, confusion_matrix
from app.feature_extractor import extract_fingerprint


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('archive', type=Path)
    parser.add_argument('--per-class', type=int, default=200)
    parser.add_argument('--output', type=Path, default=Path('evaluation.json'))
    args = parser.parse_args()
    model_path = Path(__file__).parent / 'model.pkl'
    model = joblib.load(model_path)
    rng = random.Random(42)
    items = []
    started = time.perf_counter()
    with zipfile.ZipFile(args.archive) as archive:
        names = archive.namelist()
        for label, folder in ((0, 'real'), (1, 'fake')):
            pool = sorted(name for name in names if f'test/{folder}/' in name.replace('\\', '/') and name.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')))
            if not pool:
                raise RuntimeError(f'No labeled test/{folder} images found')
            items.extend((name, label) for name in rng.sample(pool, min(args.per_class, len(pool))))
        features, truth, evaluated, failures = [], [], [], []
        for index, (name, label) in enumerate(items):
            try:
                with Image.open(io.BytesIO(archive.read(name))) as image:
                    image.load()
                    features.append(extract_fingerprint(image))
                truth.append(label)
                evaluated.append(name)
            except Exception as exc:
                failures.append({'image': name, 'error_type': type(exc).__name__})
            if (index + 1) % 100 == 0:
                print(f'Processed {index + 1}/{len(items)}', flush=True)
    matrix = np.asarray(features)
    # Match /predict: use P(fake) >= 0.5, not model.predict's label rule.
    fake_index = next(i for i, label in enumerate(model.classes_) if str(label).lower() in {'fake','ai','1','synthetic','generated'})
    prediction = (model.predict_proba(matrix)[:, fake_index] >= 0.5).astype(int)
    report = {
        'scope': 'Local backend/model.pkl only; not a remote Render or Gemma evaluation',
        'method': f'Seed 42; sorted test/real and test/fake pools; up to {args.per_class} per class; existing serving features and threshold; no retraining',
        'model_sha256': hashlib.sha256(model_path.read_bytes()).hexdigest(),
        'sklearn_runtime': sklearn.__version__,
        'feature_count': int(matrix.shape[1]),
        'sample_count': len(truth),
        'accuracy': accuracy_score(truth, prediction),
        'balanced_accuracy': balanced_accuracy_score(truth, prediction),
        'confusion_matrix_rows_true_columns_predicted_real_fake': confusion_matrix(truth, prediction, labels=[0,1]).tolist(),
        'elapsed_seconds': round(time.perf_counter() - started, 3),
        'failures': failures,
        'images': evaluated,
        'limitations': ['Dataset provenance and training overlap are not established. This is a sampled test-folder score, not universal or independently verified held-out accuracy.', 'Gemma and the 80/20 ensemble were not evaluated. Weights are a product preference, not accuracy calibration.'],
    }
    args.output.write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(json.dumps({key: value for key, value in report.items() if key != 'images'}, indent=2))


if __name__ == '__main__':
    main()
