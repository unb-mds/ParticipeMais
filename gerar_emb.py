import pandas as pd
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS

# 1. Carrega as propostas limpas
df = pd.read_csv("propostas_limpa.csv")

# 2. Pega os textos
textos = df["propostas_processadas"].dropna().tolist()

# 3. Instancia o modelo de embeddings
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# 4. Cria o índice vetorial FAISS com LangChain
vectorstore = FAISS.from_texts(texts=textos, embedding=embedding_model)

# 5. Salva o índice FAISS localmente
vectorstore.save_local("faiss_index")
print("✅ Embeddings gerados e índice salvo em 'faiss_index/'")