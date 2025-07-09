import pandas as pd
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
import os

# Caminhos
CLUSTERS_CSV = "../data/clusters/conferencia_com_clusters.csv"
FAISS_OUTPUT_PATH = "../data/embeddings/faiss_index_propostas"

# Garante a pasta
os.makedirs(FAISS_OUTPUT_PATH, exist_ok=True)

# 1. Carrega dados classificados com cluster_id
df = pd.read_csv(CLUSTERS_CSV)
df = df.dropna(subset=["proposta", "cluster_id"])  # Evita problemas
df["proposta"] = df["proposta"].astype(str)

# 2. Constrói documentos com metadados
documentos = [
    Document(page_content=row["proposta"], metadata={"cluster_id": int(row["cluster_id"])})
    for _, row in df.iterrows()
]

# 3. Instancia modelo de embeddings
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# 4. Cria FAISS com metadados
vectorstore = FAISS.from_documents(documentos, embedding=embedding_model)

# 5. Salva
vectorstore.save_local(FAISS_OUTPUT_PATH)
print("✅ FAISS com metadados salvo em:", FAISS_OUTPUT_PATH)
