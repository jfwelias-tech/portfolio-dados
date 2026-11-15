# Como publicar esta versão parcial no portfólio

A pasta do projeto foi organizada para ficar em `portfolio-dados/projects/alo-cidade/`. Nenhum arquivo da página inicial existente será substituído automaticamente.

1. Abra o repositório **jfwelias-tech/portfolio-dados** no GitHub.
2. Envie todo o conteúdo da pasta `projects/alo-cidade/`, preservando as subpastas `assets/`, `data/`, `scripts/`, `docs/` e `sql/`.
3. Adicione um card ou link na sua página inicial `index.html` apontando para **`projects/alo-cidade/index.html`**. Adapte os estilos ao padrão visual atual do site.
4. Publique/atualize a branch usada pelo GitHub Pages e abra o link para conferir imagens, alternância PT/EN e navegação.
5. Faça um commit com mensagem, por exemplo: `feat: publica resultados parciais do projeto 03 Alô, Cidade!`.

## Texto de apresentação do card (PT)

**Alô, Cidade! — O que os Chamados 156 Revelam**  
SQL · MySQL · Qualidade de dados · Análise temporal  
Auditoria de 41.490 registros da Central 156 de Curitiba, com 39.451 solicitações distintas, tratamento de horários e um heatmap que revela os períodos de maior demanda. **Resultados parciais.**

## Card text (EN)

**Hello, City! — What the City's 156 Service Requests Reveal**  
SQL · MySQL · Data Quality · Temporal Analysis  
An audit of 41,490 municipal service records covering 39,451 distinct requests, time cleaning and a heatmap of peak demand periods. **Preliminary findings.**

## Link HTML de referência

```html
<a href="projects/alo-cidade/index.html">Alô, Cidade! — SQL e análise dos chamados 156</a>
```

**Nota:** o design do card deve seguir o CSS e a estrutura do `index.html` já existente no seu repositório.

## Atenção ao `.gitignore` já existente

Não substitua o `.gitignore` da raiz do seu portfólio. Se ainda não houver uma regra semelhante, adicione `chamados156*.csv` e `.env` ao arquivo existente para evitar publicações acidentais.
