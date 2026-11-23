# Projeto 04 · Titanic: seu personagem sobreviveria?

[Embarcar no simulador](https://jfwelias-tech.github.io/portfolio-dados/projects/titanic/)

## O problema

Muita gente conhece a história do Titanic pelo clássico de James Cameron. Entre romances e tragédias, o filme recria a viagem do navio que partiu de Southampton, na Inglaterra, em 10 de abril de 1912. Com o apoio da inteligência artificial e do machine learning, podemos identificar quais características dos passageiros estiveram associadas à sobrevivência ao naufrágio?

A base do Titanic é popular entre estudantes de ciência de dados em projetos de exploração e previsão. A versão usada neste projeto foi adquirida online: [Consultar o CSV](https://drive.google.com/file/d/1YBOVngIdbdPAarnzADnPwTjNZuvBQinO/view)

## A solução e o processo

No Google Colab, explorei idade, sexo e classe da passagem com Python e Pandas. Separei 712 registros para treino e 179 para teste, preservando a proporção de sobreviventes. Havia 177 idades ausentes. Para os gráficos, usei as 714 idades registradas. Para o modelo, preenchi as lacunas com a mediana calculada dentro de cada etapa de treino.

Comparei regressão logística e árvore de decisão nas mesmas cinco divisões do treino. A árvore, limitada a três níveis, atingiu 81,2% de acurácia média, contra 78,8% da regressão. Usei o Codex como apoio de IA para escrever e conferir o código. [Ver o notebook](../../Projeto_04_Titanic_Machine_Learning.ipynb)

## Resultados e visualização

A árvore acertou **137 de 179 casos no teste (76,5%)**, contra 110 da regra de sempre prever o desfecho mais frequente (61,5%). Identificou 45 dos 69 sobreviventes, com recall de 65,2% e precisão de 71,4%.

A página inclui o histograma das idades, o gráfico de pontos por sobrevivência, a matriz de confusão e a árvore de decisão. A amostra representa parte dos passageiros e algumas folhas da árvore têm poucos exemplos.

No simulador, cada embarque sorteia o destino do personagem a partir da estimativa da árvore. Signo e número da sorte são regras de ficção aplicadas ao sorteio. Os detalhes do embarque mostram a estimativa do modelo e a chance usada no jogo.
