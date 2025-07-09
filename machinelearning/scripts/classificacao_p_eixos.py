import pandas as pd
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# Caminhos
CAMINHO_FAISS = "/home/camposs/Desktop/projeto_final/machineLearning/embeddings/faiss_index_prp_processadas"
CAMINHO_CSV_NOVAS = "../data/propostas/propostas_limpa.csv"
CAMINHO_SAIDA = "../data/propostas/propostas_novas_classificadas.csv"

# Modelo de Embedding
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Carrega FAISS com metadados (como cluster_id)
vectorstore = FAISS.load_local(
    folder_path=CAMINHO_FAISS,
    index_name="index",
    embeddings=embedding_model,
    allow_dangerous_deserialization=True
)
print("✅ FAISS carregado com metadados!")

# Carrega novas propostas (pré-processadas)
df_novas = pd.read_csv(CAMINHO_CSV_NOVAS)
coluna_texto = "propostas1_processadas"

# 🔎 Classificação
propostas_similares = []
clusters_atribuidos = []

print("🔍 Classificando propostas...")

for texto in df_novas[coluna_texto]:
    resultado = vectorstore.similarity_search_with_score(texto, k=1)
    if resultado:
        doc, score = resultado[0]
        cluster_id = doc.metadata.get("cluster_id", -1)
        propostas_similares.append(doc.page_content)
        clusters_atribuidos.append(cluster_id)
    else:
        propostas_similares.append("")
        clusters_atribuidos.append(-1)

# Adiciona ao dataframe original
df_novas["proposta_mais_proxima"] = propostas_similares
df_novas["cluster_id"] = clusters_atribuidos

# (Opcional) Mapeamento de cluster → eixo temático
mapa_clusters = {
    0: "Educação Ambiental",
    1: "Mobilidade Urbana",
    2: "Justiça Climática",
    3: "Saúde Pública",
    4: "Governança Participativa"
}
df_novas["eixo_tematico"] = df_novas["cluster_id"].map(mapa_clusters)

# Salva o resultado
df_novas.to_csv(CAMINHO_SAIDA, index=False)
print(f"✅ Classificação finalizada e salva em '{CAMINHO_SAIDA}'")

# Resumo
print("📊 Resumo de clusters atribuídos:")
print(df_novas["cluster_id"].value_counts(dropna=False))
