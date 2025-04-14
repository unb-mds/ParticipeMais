# Extração Automatizada de Propostas - Brasil Participativo

Este script automatiza a navegação e coleta de dados da plataforma [Brasil Participativo](https://brasilparticipativo.presidencia.gov.br/), permitindo acessar todas as propostas públicas dos processos disponíveis.

## Objetivo

Automatizar a extração de propostas públicas, estruturando os dados e facilitando análises posteriores para suporte a decisões públicas.

## Funcionalidades

- Percorre automaticamente as seções: **Conferências**, **Consultas Públicas** e **Planos**.
- Entra em cada processo e acessa as páginas de propostas.
- Filtra e abre propostas reais (ignora documentos e notícias).
- Coleta títulos das propostas (em construção futura: coletar autor, descrição, localização, etc.).
- Evita duplicidade de acessos e repetições desnecessárias.
- Lida com múltiplas abas e navega entre páginas numeradas de forma confiável.

## Dependências

As bibliotecas Python utilizadas estão listadas em requirements.txt (exemplo para uso com `pip install -r requirements.txt`):

## Requisitos
- Python 3.8+
- Firefox + GeckoDriver configurado no PATH

## Execução

python scraper.py


