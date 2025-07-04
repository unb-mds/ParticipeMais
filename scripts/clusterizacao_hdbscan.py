import pandas as pd
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import hdbscan
import numpy as np

print("🔄 Carregando índice FAISS...")

embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

vectorstore = FAISS.load_local(
    folder_path="codigos/faiss_index",
    embeddings=embedding_model,
    allow_dangerous_deserialization=True
)

docs = vectorstore.docstore._dict
textos = [d.page_content for d in docs.values()]
vetores = np.array([vectorstore.index.reconstruct(i) for i in range(len(docs))])

print("🧠 Aplicando HDBSCAN...")
clusterer = hdbscan.HDBSCAN(min_cluster_size=5, metric='euclidean')
labels = clusterer.fit_predict(vetores)

df_clusters = pd.DataFrame({
    "proposta": textos,
    "cluster_id": labels
})

df_clusters.to_csv("conferencia_com_clusters.csv", index=False)
print("✅ Clusterização concluída e salva como 'conferencia_com_clusters.csv'")
