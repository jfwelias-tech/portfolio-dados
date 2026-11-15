"""Regenera os 3 gráficos com o CSV agregado exportado da consulta SQL.
Uso: python scripts/gerar_graficos.py
Dependências: matplotlib, numpy
"""
import csv
from collections import Counter
from pathlib import Path
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

ROOT = Path(__file__).resolve().parents[1]
with (ROOT / 'data' / 'heatmap_agregado.csv').open(encoding='utf-8-sig', newline='') as f:
    rows = list(csv.DictReader(f))
assert sum(int(x['total_solicitacoes']) for x in rows) == 39451
hours, days = Counter(), Counter()
weekday_order = [2,3,4,5,6,7,1]
matrix = np.zeros((7,24))
for r in rows:
    d, h, n = int(r['dia_numero']), int(r['hora_do_dia']), int(r['total_solicitacoes'])
    days[d]+=n
    hours[h]+=n
    matrix[weekday_order.index(d),h] = float(r['media_por_dia'])
assets=ROOT/'assets';assets.mkdir(exist_ok=True)
fmt=FuncFormatter(lambda x,p: f'{int(x):,}'.replace(',','.'))
fig,ax=plt.subplots(figsize=(12,4.8),layout='constrained')
ax.bar(range(24),[hours[h] for h in range(24)])
ax.set(title='Distribuição das solicitações por hora do dia',xlabel='Hora de registro (0–23)',ylabel='Solicitações distintas')
ax.set_xticks(range(24),[f'{i:02d}' for i in range(24)]);ax.yaxis.set_major_formatter(fmt)
ax.spines[['top','right']].set_visible(False);ax.grid(axis='y',alpha=.2);ax.set_axisbelow(True)
fig.savefig(assets/'solicitacoes_por_hora.png',dpi=210,facecolor='white');plt.close(fig)
observed={1:4,2:5,3:5,4:5,5:4,6:4,7:4}
fig,ax=plt.subplots(figsize=(9,4.8),layout='constrained')
ax.bar(['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],[days[d]/observed[d] for d in range(1,8)])
ax.set(title='Média de solicitações por dia da semana',ylabel='Solicitações distintas por dia observado')
ax.yaxis.set_major_formatter(fmt);ax.spines[['top','right']].set_visible(False);ax.grid(axis='y',alpha=.2);ax.set_axisbelow(True)
fig.savefig(assets/'media_por_dia_semana.png',dpi=210,facecolor='white');plt.close(fig)
fig,ax=plt.subplots(figsize=(15,5.6),layout='constrained')
im=ax.imshow(matrix,aspect='auto',interpolation='nearest',vmin=0)
ax.set_xticks(range(24),[f'{h:02d}h' for h in range(24)])
ax.set_yticks(range(7),['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'])
ax.set(title='Quando os cidadãos acionam a Central 156?',xlabel='Hora do dia')
fig.colorbar(im,ax=ax,label='Média de solicitações por hora')
fig.savefig(assets/'heatmap_dia_hora.png',dpi=220,facecolor='white')
fig.savefig(assets/'heatmap_dia_hora.svg',facecolor='white')
plt.close(fig)
print('Gráficos regenerados em',assets)
