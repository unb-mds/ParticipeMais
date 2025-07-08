````markdown
# 🧠 Cluster de Propostas com NLP + IA — Projeto Participa+

Este módulo implementa o pipeline de **análise semântica**, **clusterização automática** e **classificação temática** de propostas públicas extraídas do site [Brasil Participativo](https://brasilparticipativo.presidencia.gov.br/).

O projeto visa agrupar as propostas por **similaridade temática** e classificá-las em **eixos interpretáveis**, utilizando técnicas de **NLP**, **embeddings semânticos**, **FAISS** e **algoritmos não supervisionados (como HDBSCAN)**.

---

## 📌 Etapas do Pipeline

```text
✅ 1. Coleta por WebScraping
✅ 2. Pré-processamento textual
✅ 3. Geração de embeddings semânticos com LangChain
✅ 4. Indexação com FAISS
✅ 5. Clusterização com HDBSCAN
✅ 6. Visualizações com UMAP + WordCloud
✅ 7. Classificação automática de novas propostas
🔜 8. Integração com frontend interativo (Kotlin ou Streamlit)
````

---

## ⚙️ Instalação e Ambiente

1. **Crie o ambiente virtual**:

```bash
python -m venv venv
source venv/bin/activate        # Linux/macOS
venv\Scripts\activate           # Windows
```

2. **Instale as dependências**:

```bash
pip install -r requirements.txt
```

> 💡 Em sistemas Windows, troque `faiss-cpu` por `faiss-cpu-windows` no arquivo `requirements.txt`.

---

## 🚀 Execução do Pipeline

Você pode executar o projeto etapa por etapa ou rodar **automaticamente com o script** `run_pipeline.sh`.

### ▶️ Rodar tudo de uma vez (recomendado)

```bash
chmod +x run_pipeline.sh
./run_pipeline.sh
```

### 🎯 Etapas individuais

```bash
python scripts/integracao.py             # Etapa 1 - Pré-processamento
python scripts/gerar_emb.py              # Etapa 2 - Embeddings + FAISS
python scripts/clusterizacao_hdbscan.py  # Etapa 3 - Clusterização
python scripts/classificacao_p_eixos.py  # Etapa 4 - Classificação de novas propostas
python scripts/gerar_wordclouds.py       # Etapa 5 - Visualizações
```

---

## 📁 Estrutura do Projeto

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
├── run_pipeline.sh         ← Automação completa do pipeline
├── requirements.txt
└── README.md
```

---

## 🧠 Sobre os Eixos Temáticos

Os clusters (`cluster_id`) são rotulados com eixos como:

```python
mapa_clusters = {
    0: "Educação Ambiental",
    1: "Mobilidade Urbana",
    2: "Justiça Climática",
    3: "Saúde Pública",
    4: "Governança Participativa"
}
```

Isso permite gerar uma saída interpretável como:

| proposta                             | eixo\_tematico     |
| ------------------------------------ | ------------------ |
| Criar hortas escolares               | Educação Ambiental |
| Construir ciclovias em zonas urbanas | Mobilidade Urbana  |

---

## 🧪 Exemplos de Aplicações

* Busca semântica por propostas semelhantes
* Navegação temática por tópicos
* Análise de demandas cidadãs por áreas do governo
* Classificação automatizada de novos textos com IA
* Interface com frontend em Kotlin, React ou Streamlit

---

## 🤝 Colaboração

Pull requests e sugestões são muito bem-vindos!

```
