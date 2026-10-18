import unittest

from app.main import compute_ensemble_fusion


class EnsembleTests(unittest.TestCase):
    def test_gemma_dominates_disagreement_in_both_directions(self):
        for local_label, gemma_label, expected_fake in (
            ('fake', 'real', 0.2 * 0.99 + 0.8 * 0.10),
            ('real', 'fake', 0.2 * 0.01 + 0.8 * 0.90),
        ):
            with self.subTest(gemma=gemma_label):
                prediction, confidence, meta = compute_ensemble_fusion(
                    (local_label, 0.99),
                    {'available': True, 'prediction': gemma_label, 'confidence': 0.90},
                )
                self.assertEqual(prediction, gemma_label)
                self.assertAlmostEqual(meta['fused_p_fake'], expected_fake, places=4)
                expected_conf = expected_fake if gemma_label == 'fake' else 1 - expected_fake
                self.assertAlmostEqual(confidence, expected_conf, places=4)
                self.assertEqual((meta['nim_weight'], meta['fourier_weight']), (0.8, 0.2))

    def test_lower_gemma_confidence_keeps_80_20_weights(self):
        _, _, meta = compute_ensemble_fusion(
            ('real', 0.9), {'available': True, 'prediction': 'fake', 'confidence': 0.6})
        self.assertAlmostEqual(meta['fused_p_fake'], 0.50)
        self.assertEqual((meta['nim_weight'], meta['fourier_weight']), (0.8, 0.2))

    def test_agreement_preserves_same_confidence(self):
        for label in ('real', 'fake'):
            prediction, confidence, _ = compute_ensemble_fusion(
                (label, 0.9), {'available': True, 'prediction': label, 'confidence': 0.9})
            self.assertEqual(prediction, label)
            self.assertAlmostEqual(confidence, 0.9)

    def test_fallbacks_use_the_only_available_model(self):
        prediction, confidence, meta = compute_ensemble_fusion(('fake', 0.73), None)
        self.assertEqual((prediction, confidence, meta['fourier_weight'], meta['nim_weight']), ('fake', 0.73, 1.0, 0.0))
        prediction, confidence, meta = compute_ensemble_fusion(
            None, {'available': True, 'prediction': 'real', 'confidence': 0.84})
        self.assertEqual((prediction, confidence, meta['fourier_weight'], meta['nim_weight']), ('real', 0.84, 0.0, 1.0))


if __name__ == '__main__':
    unittest.main()
