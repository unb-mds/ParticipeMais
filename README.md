---

# 🕸️ Web Scraper – Projeto Brasil Participativo

Este repositório contém os scrapers desenvolvidos para coletar dados de **Conferências**, **Consultas Públicas** e **Planos** da plataforma [Brasil Participativo](https://brasilparticipativo.presidencia.gov.br/).

O objetivo é automatizar a coleta de dados públicos para apoiar análises qualitativas e a aplicação de inteligência artificial (clusterização, categorização e visualizações) no projeto **Participa+**.

---

## 📁 Estrutura do Projeto



webscraper/
├── scraper\_conf.py             # Scraper das conferências
├── scraper\_consultas.py        # Scraper das consultas públicas
├── scraper\_planos.py           # Scraper dos planos participativos
├── anlise.py                   # Script para análise dos dados com pandas
├── resultados/                 # CSVs gerados automaticamente



---

## 📦 Estrutura de Pastas e Arquivos Gerados

Durante a execução dos scrapers, os dados extraídos são organizados automaticamente dentro da pasta `resultados/`, separados por tipo de participação:



📦 resultados/
├── conferencias/
│   ├── conferencias.csv             # Informações gerais das conferências
│   ├── conferenciass.csv            # Título, imagem, descrição
│   ├── encerradas.csv               # Conferências finalizadas
│   ├── etapas.csv                   # Etapas por conferência
│   ├── perguntas.csv                # Perguntas participativas
│   └── propostas.csv                # Propostas associadas às conferências
│
├── consultas/
│   ├── dados\_consultas.csv          # Informações principais das consultas públicas
│   ├── proposta\_consultas.csv       # Propostas feitas nas consultas
│   └── sobre\_consultas.csv          # Conteúdos da aba "Sobre"
│
└── planos/
├── oficinas.csv                 # Dados de oficinas participativas
├── planos\_dados.csv             # Dados gerais dos planos
├── planos.csv                   # Informações resumidas dos planos
└── propostas\_planos.csv         # Propostas enviadas para os planos

`

---

## 🔧 Requisitos

### ✅ Python 3.8 ou superior

### 📦 Instalar dependências

Crie um ambiente virtual (opcional):

bash
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate no Windows
`

Instale os pacotes:

bash
pip install -r requirements.txt


**`requirements.txt`**:

txt
selenium
beautifulsoup4
pandas
requests


> ⚠️ **Você também precisará de um driver de navegador compatível:**
>
> * Chrome: [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/)
> * Firefox: [GeckoDriver](https://github.com/mozilla/geckodriver/releases)

---

## 🧠 Lógica dos Scrapers

### `scraper_conf.py`

Extrai dados de **Conferências**, incluindo:

* Título, descrição e imagem
* Etapas com status, data e região
* Propostas (título, autor, votos)
* \[Comentado] Perguntas participativas

Gera os arquivos:

* `conferenciass.csv`
* `etapas.csv`
* `propostas.csv`
* `encerradas.csv`

---

### `scraper_consultas.py`

Coleta dados de **Consultas Públicas**:

* Dados gerais da consulta
* Propostas e comentários participativos
* Anexos como decretos, portarias e parágrafos participativos

Gera os arquivos:

* `dados_consultas.csv`
* `proposta_consultas.csv`
* `sobre_consultas.csv`

---

### `scraper_planos.py`

Extrai dados de **Planos Participativos**:

* Nome do plano, propostas, autores, votos

Gera os arquivos:

* `planos.csv`
* `planos_dados.csv`
* `propostas_planos.csv`
* `oficinas.csv`

---

## 📊 Análise de Dados

Use `anlise.py` para explorar os dados com pandas:

python
import pandas as pd
df = pd.read_csv("resultados/conferencias/propostas.csv")
print(df[df["Autor"] == "RAQUEL"])
```

---

## ✨ Funcionalidades Extras

* Armazena links visitados em propostas_visitadas.txt
* Usa BeautifulSoup para extrair trechos de HTML
* Usa Selenium para clicar, navegar e abrir novas abas
* Exporta para CSV com headers definidos dinamicamente

---

## 🤝 Contribuição

Caso deseje contribuir com melhorias, padronizações ou novos scrapers, fique à vontade para abrir issues ou pull requests.

---
