#!/bin/bash

echo "🚀 Iniciando pipeline do projeto Participa+"
source ../venv/bin/activate

echo "🧹 Etapa 1 — Pré-processamento textual..."
python scripts/integracao.py

echo "🧠 Etapa 2 — Geração de embeddings..."
python scripts/gerar_emb.py

echo "🧪 Etapa 3 — Clusterização com HDBSCAN..."
python scripts/clusterizacao_hdbscan.py

echo "🏷️ Etapa 4 — Classificação automática de novas propostas..."
python scripts/classificacao_p_eixos.py

echo "☁️ Etapa 5 — Geração de WordClouds e UMAP..."
python scripts/gerar_wordclouds.py

echo "✅ Pipeline finalizado com sucesso!"
