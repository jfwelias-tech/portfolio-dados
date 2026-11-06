#!/usr/bin/env python3
"""Injeta uma ÚNICA linha JS em cada página e salva backup fora do repositório.
Não substitui o HTML inteiro nem edita CSS/JS dos dashboards.
"""
from pathlib import Path
from datetime import datetime
import os
import re
import shutil
import sys

HERE = Path(__file__).resolve().parent
SCRIPTS = {
    'index.html': 'assets/portfolio-global-header-v13.js',
    'projects/copa-2026-powerbi/index.html': '../../assets/portfolio-global-header-v13.js',
    'projects/idhm-brasil/index.html': '../../assets/portfolio-global-header-v13.js',
}

def choose_repo():
    if len(sys.argv)>1: return Path(sys.argv[1]).expanduser().resolve()
    try:
        import tkinter as tk
        from tkinter import filedialog
        app=tk.Tk();app.withdraw();app.attributes('-topmost',True)
        chosen=filedialog.askdirectory(title='Selecione a pasta do repositório portfolio-dados')
        app.destroy()
        if chosen: return Path(chosen).resolve()
    except Exception as exc:
        print('Não foi possível abrir seletor de pastas:',exc)
    raise SystemExit('Pasta do repositório não selecionada.')

def main():
    repo=choose_repo()
    print('Repositório:',repo)
    if not (repo/'.git').exists():
        raise SystemExit('ERRO: pasta não parece ser um repositório Git (sem .git).')
    if not (HERE/'assets/portfolio-global-header-v13.js').exists():
        raise SystemExit('ERRO: falta o arquivo JS no pacote extraído.')
    updated={}
    for relative,script in SCRIPTS.items():
        filepath=repo/relative
        if not filepath.is_file(): raise SystemExit(f'ERRO: não encontrei {relative}; nada foi alterado.')
        html=filepath.read_text(encoding='utf-8-sig')
        if not re.search(r'<header\b[^>]*(?:site-nav|idhm-global-header|\bheader\b)',html,re.I):
            raise SystemExit(f'ERRO: cabeçalho esperado não encontrado em {relative}; nada foi alterado.')
        if not re.search(r'</head>',html,re.I): raise SystemExit(f'ERRO: </head> não encontrado em {relative}; nada foi alterado.')
        if 'portfolio-global-header-v13.js' in html:
            updated[relative]=None
        else:
            tag=f'<script src="{script}" defer></script>\n'
            changed=re.sub(r'</head>',tag+'</head>',html,count=1,flags=re.I)
            updated[relative]=changed
    backdir=repo.parent/(repo.name+'-backup-v13-'+datetime.now().strftime('%Y%m%d-%H%M%S'))
    backdir.mkdir(parents=True,exist_ok=False)
    for relative in SCRIPTS:
        b=backdir/relative;b.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(repo/relative,b)
    dst=repo/'assets/portfolio-global-header-v13.js'
    if dst.exists():
        (backdir/'assets').mkdir(exist_ok=True)
        shutil.copy2(dst,backdir/'assets'/dst.name)
    for relative,changed in updated.items():
        if changed is not None: (repo/relative).write_text(changed,encoding='utf-8')
    dst.parent.mkdir(exist_ok=True)
    shutil.copy2(HERE/'assets/portfolio-global-header-v13.js',dst)
    print('\nCorreção aplicada. Backups em:',backdir)
    print('Arquivos esperados no GitHub Desktop:')
    for relative in SCRIPTS: print(' -',relative,'(já modificado antes)' if updated[relative] is None else '')
    print(' - assets/portfolio-global-header-v13.js')
    print('\nRevise os arquivos em Changes ANTES de fazer commit/push.')

if __name__=='__main__':
    try: main()
    except Exception as e:
        print('ERRO:',e)
        sys.exit(1)
