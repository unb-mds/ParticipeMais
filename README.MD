````markdown
# 🧠 Projeto Participa+ — Clusterização de Propostas com NLP + IA

Este módulo aplica **Processamento de Linguagem Natural (NLP)** e **Inteligência Artificial** para organizar, agrupar e classificar propostas públicas extraídas do portal [Brasil Participativo](https://brasilparticipativo.presidencia.gov.br/).  
O objetivo é apoiar análises qualitativas e decisões públicas com base em agrupamentos temáticos automáticos.

---

## 🤖 Machine Learning — Visão Geral

### ✅ O que foi feito:
- 🔹 Pré-processamento textual das propostas
- 🔹 Geração de embeddings semânticos via LangChain
- 🔹 Indexação com FAISS
- 🔹 Clusterização com HDBSCAN
- 🔹 Classificação automática de novas propostas
- 🔹 Visualização com UMAP e WordClouds

---

### 🛠️ Como foi feito:
- 🔸 Limpeza e normalização de texto (stopwords, acentos, links, etc.)
- 🔸 Vetorização com `all-MiniLM-L6-v2` da HuggingFace usando LangChain
- 🔸 Armazenamento vetorial com **FAISS** para busca semântica
- 🔸 Agrupamento com **HDBSCAN** (densidade adaptativa)
- 🔸 Visualização dos temas com **UMAP** + nuvens de palavras

---

### 🎯 Para que serve:
- 🧭 Facilitar a **análise temática automatizada** das propostas
- 🔍 Suportar **buscas por similaridade semântica**
- 🧾 Auxiliar na **categorização e clusterização** de novas propostas
- 📊 Gerar **insumos para dashboards e visualizações públicas**

---

## 🧪 Pipeline de Execução

```text
✅ 1. WebScraping das propostas (já feito)
✅ 2. Pré-processamento textual
✅ 3. Geração de embeddings semânticos
✅ 4. Armazenamento vetorial com FAISS
✅ 5. Clusterização temática com HDBSCAN
✅ 6. Visualizações com UMAP + WordClouds
✅ 7. Classificação automática de novas propostas
🔜 8. Integração com frontend interativo
````

---

## ⚙️ Instalação do Ambiente

```bash
# 1. Criar ambiente virtual
python -m venv venv
source venv/bin/activate      # Linux/macOS
venv\Scripts\activate         # Windows

# 2. Instalar dependências
pip install -r requirements.txt
```

> 💡 Se estiver no Windows, edite o `requirements.txt` e troque `faiss-cpu` por `faiss-cpu-windows`.

---

## 🚀 Como Executar

### ✅ Rodar o pipeline completo automaticamente:

```bash
chmod +x run_pipeline.sh
./run_pipeline.sh
```

### 🧩 Ou etapa por etapa:

```bash
python scripts/integracao.py               # Etapa 1 — Pré-processamento
python scripts/gerar_emb.py                # Etapa 2 — Geração de embeddings
python scripts/clusterizacao_hdbscan.py    # Etapa 3 — Clusterização
python scripts/classificacao_p_eixos.py    # Etapa 4 — Classificação
python scripts/gerar_wordclouds.py         # Etapa 5 — Visualizações
```

---

## 🗂️ Estrutura Recomendada

```
machineLearning/
├── data/
│   ├── conferencia_com_clusters.csv
│   ├── propostas_classificadas.csv
│   └── embeddings/
│       ├── faiss_index/
│       ├── faiss_encerradas_index/
│       └── faiss_prp_index/
│
├── scripts/
│   ├── integracao.py
│   ├── gerar_emb.py
│   ├── clusterizacao_hdbscan.py
│   ├── gerar_wordclouds.py
│   └── classificacao_p_eixos.py
│
├── visualizacoes/
│   ├── mapa_umap_clusters.png
│   └── nuvens/
│       └── cluster_0.png ...
│
├── run_pipeline.sh
├── requirements.txt
└── README.md
```

---

## 📊 Resultados Gerados

| Arquivo                        | Descrição                                          |
| ------------------------------ | -------------------------------------------------- |
| `propostas_classificadas.csv`  | Propostas novas com eixo temático                  |
| `conferencia_com_clusters.csv` | Propostas agrupadas por `cluster_id`               |
---

## 🏷️ Exemplo de Mapeamento de Clusters

```python
mapa_clusters = {
    0: "Educação Ambiental",
    1: "Mobilidade Urbana",
    2: "Justiça Climática",
    3: "Saúde Pública",
    4: "Governança Participativa"
}
```
---

## 🤝 Contribuindo

Pull requests, feedbacks e novas ideias são super bem-vindos!
Este é um projeto colaborativo para fortalecer a **inteligência cidadã com IA**.

---
