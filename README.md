# Extração Automatizada de Propostas - Brasil Participativo

Este script automatiza a navegação e coleta de dados da plataforma [Brasil Participativo](https://brasilparticipativo.presidencia.gov.br/), permitindo acessar todas as propostas públicas dos processos disponíveis.

## Objetivo

Automatizar a extração de propostas públicas, estruturando os dados e facilitando análises posteriores para suporte a decisões públicas.

## Funcionalidades

- Percorre automaticamente as seções: **Conferências**, **Consultas Públicas** e **Planos**.
- Entra em cada processo e acessa as páginas de propostas.
- Filtra e abre propostas reais (ignora documentos e notícias).
- Coleta títulos e descrição das conferências, além de título e descrição das propostas
- Evita duplicidade de acessos e repetições desnecessárias.
- Lida com múltiplas abas e navega entre páginas numeradas de forma confiável.

## Dependências

- selenium (pip install selenium)
- beautifulsoup4 (pip install beautifulsoup4)

## Requisitos
- Python 3.8+
- Firefox + GeckoDriver configurado no PATH

## Execução

python scraper_conf.py


