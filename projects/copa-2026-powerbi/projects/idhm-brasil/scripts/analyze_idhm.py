"""Reproducible analysis of Atlas Brasil municipal IDHM (1991/2000/2010).

Run from the repository root:
  python projects/idhm-brasil/scripts/analyze_idhm.py

Outputs a small JSON artifact used by the static GitHub Pages dashboard.
No external API, credentials, or private data are needed.
"""
from __future__ import annotations

import json
from pathlib import Path
import pandas as pd

BASE = Path(__file__).resolve().parents[1]
INPUT = BASE / 'data' / 'idhm_municipios_1991_2000_2010.csv'
OUTPUT = BASE / 'data' / 'idhm_dashboard.json'
YEARS = (1991, 2000, 2010)
METRICS = ('IDHM', 'IDHM_E', 'IDHM_R', 'IDHM_L')


def build() -> dict:
    df = pd.read_csv(INPUT, dtype={'Codmun7': 'string', 'Codmun6': 'string', 'UF_sigla': 'string'})
    required = {'ANO', 'Codmun7', 'Municipio', 'UF_sigla', *METRICS}
    assert required.issubset(df.columns), f'Columns missing: {required - set(df.columns)}'
    assert set(df['ANO'].unique()) == set(YEARS), 'Unexpected years'
    assert len(df) == 16_695, 'Unexpected observation count'
    assert df['Codmun7'].nunique() == 5_565, 'Unexpected municipality count'
    assert not df.duplicated(['Codmun7', 'ANO']).any(), 'Duplicated municipality-year records'
    assert not df[list(METRICS)].isna().any().any(), 'Missing index values'
    assert df[list(METRICS)].ge(0).all().all() and df[list(METRICS)].le(1).all().all(), 'Index outside 0-1'
    assert (df.groupby('ANO')['Codmun7'].nunique() == 5_565).all(), 'Incomplete time series'

    # 2010 is the geographical unit of the harmonized Atlas historical panel.
    meta = df[df.ANO == 2010].set_index('Codmun7')[['Municipio', 'UF_sigla']]
    wide = df.pivot(index='Codmun7', columns='ANO', values=list(METRICS))
    municipalities = []
    for code, values in wide.iterrows():
        municipality = {'code': str(code), 'name': str(meta.loc[code, 'Municipio']), 'state': str(meta.loc[code, 'UF_sigla'])}
        for metric in METRICS:
            municipality[metric] = [round(float(values[(metric, y)]), 3) for y in YEARS]
        municipality['delta'] = round(municipality['IDHM'][2] - municipality['IDHM'][0], 3)
        municipalities.append(municipality)
    municipalities.sort(key=lambda m: (m['state'], m['name'], m['code']))

    averages = df.groupby('ANO')[list(METRICS)].mean().reindex(list(YEARS))
    means = {m: [round(float(x), 6) for x in averages[m]] for m in METRICS}
    state_averages = []
    for state, chunk in df[df.ANO == 2010].groupby('UF_sigla'):
        state_averages.append({'state': str(state), 'municipalities': int(len(chunk)), 'mean': round(float(chunk.IDHM.mean()), 6)})
    state_averages.sort(key=lambda r: r['mean'], reverse=True)

    top = sorted(municipalities, key=lambda r: (-r['IDHM'][2], r['name']))[:5]
    growth = sorted(municipalities, key=lambda r: (-r['delta'], r['name']))[:5]
    return {
        'source': 'Atlas do Desenvolvimento Humano no Brasil (PNUD, Ipea, FJP); Censos 1991, 2000 e 2010',
        'source_url': 'https://www.atlasbrasil.org.br/',
        'years': list(YEARS),
        'n_municipalities': len(municipalities),
        'n_records': len(df),
        'means_unweighted': means,
        'state_means_unweighted_2010': state_averages,
        'top_2010': [{'name': m['name'], 'state': m['state'], 'value': m['IDHM'][2]} for m in top],
        'top_absolute_change': [{'name': m['name'], 'state': m['state'], 'value': m['delta']} for m in growth],
        'municipalities': municipalities,
    }


if __name__ == '__main__':
    result = build()
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print('Created:', OUTPUT)
    print('Municipalities:', result['n_municipalities'])
    print('Municipal mean IDHM in 1991/2000/2010:', result['means_unweighted']['IDHM'])
    print('Highest 2010:', result['top_2010'][0])
    print('Largest absolute improvement:', result['top_absolute_change'][0])
