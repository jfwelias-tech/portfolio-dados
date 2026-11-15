# Dicionário preliminar de dados

A tabela de origem contém 21 campos. Os significados abaixo são inferências operacionais a validar com a documentação da fonte.

| Campo | Função provável | Tipo observado no MySQL |
|---|---|---|
| `id` | Identificador da linha (chave primária) | INT |
| `SOLICITACAO` | Número de protocolo da solicitação | INT |
| `TIPO` | Tipo de contato | TEXT |
| `ORGAO` | Órgão associado ao registro | TEXT |
| `DATA` | Data do registro (`dd/mm/aaaa`) | TEXT |
| `HORARIO` | Hora do registro (`HH:MM:SS`, com espaços) | TEXT |
| `ASSUNTO` | Assunto | TEXT |
| `SUBDIVISAO` | Subclassificação do assunto | TEXT |
| `DESCRICAO` | Descrição livre | TEXT |
| `LOGRADOURO_ASS` | Local associado ao chamado | TEXT |
| `BAIRRO_ASS` | Bairro associado ao chamado | TEXT |
| `REGIONAL_ASS` | Regional administrativa do chamado | TEXT |
| `MEIO_RESPOSTA` | Meio de resposta | TEXT |
| `OBSERVACAO` | Observações | TEXT |
| `SEXO` | Sexo informado | TEXT |
| `BAIRRO_CIDADAO` | Bairro informado do cidadão | TEXT |
| `REGIONAL_CIDADAO` | Regional informada do cidadão | TEXT |
| `DATA_NASC` | Data de nascimento | TEXT |
| `TIPO_CIDADAO` | Classificação do cidadão | TEXT |
| `ORGAO_RESP` | Órgão responsável informado | TEXT |
| `RESPOSTA_FINAL` | Texto da resposta | TEXT |

A coluna `id` é chave primária e `SOLICITACAO` pode se repetir. Os demais campos aceitam `NULL` no esquema observado.
