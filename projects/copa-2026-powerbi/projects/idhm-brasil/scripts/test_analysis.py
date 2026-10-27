"""Sanity checks for the reproducible IDHM analysis.

Run: python projects/idhm-brasil/scripts/test_analysis.py
"""
import unittest
from analyze_idhm import build


class IdhmAnalysisTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = build()

    def test_complete_panel(self):
        self.assertEqual(self.data['n_municipalities'], 5565)
        self.assertEqual(self.data['n_records'], 16695)
        self.assertEqual(self.data['years'], [1991, 2000, 2010])

    def test_city_ranking_2010(self):
        top = self.data['top_2010'][0]
        self.assertEqual((top['name'], top['state']), ('SÃO CAETANO DO SUL', 'SP'))
        self.assertAlmostEqual(top['value'], 0.862)

    def test_largest_absolute_increase(self):
        top = self.data['top_absolute_change'][0]
        self.assertEqual((top['name'], top['state']), ('BODÓ', 'RN'))
        self.assertAlmostEqual(top['value'], 0.493)

    def test_expected_municipal_means(self):
        means = self.data['means_unweighted']['IDHM']
        self.assertAlmostEqual(means[0], 0.381372, places=5)
        self.assertAlmostEqual(means[2], 0.659157, places=5)

    def test_no_missing_values_in_export(self):
        self.assertTrue(all(len(m['IDHM']) == 3 for m in self.data['municipalities']))
        self.assertTrue(all(0 <= value <= 1 for m in self.data['municipalities'] for value in m['IDHM']))


if __name__ == '__main__':
    unittest.main(verbosity=2)
