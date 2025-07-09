import pickle
import os
import pandas as pd

# Caminho para o .pkl
pkl_path = "/home/camposs/Desktop/projeto_final/machineLearning/embeddings/faiss_index_prp_processadas/index.pkl"
saida_csv = "/home/camposs/Desktop/projeto_final/machineLearning/propostas/index_documentos.csv"

# Verifica se o arquivo existe
if not os.path.exists(pkl_path):
    print(f"❌ Arquivo não encontrado: {pkl_path}")
    exit(1)

try:
    with open(pkl_path, "rb") as f:
        index, index_to_docstore_id, docstore = pickle.load(f)

    print("✅ Arquivo index.pkl carregado com sucesso!")
    print(f"📦 Tipo do docstore: {type(docstore)}")

    # Extrai os documentos armazenados
    all_docs = docstore._dict  # dict de {id: Document}
    print(f"🗃️ Total de documentos encontrados: {len(all_docs)}")

    # Constrói uma lista de dicionários para o DataFrame
    registros = []
    for doc_id, doc in all_docs.items():
        registros.append({
            "doc_id": doc_id,
            "texto": doc.page_content,
            **doc.metadata  # Se houver metadados adicionais
        })

    # Salva em CSV
    df = pd.DataFrame(registros)
    df.to_csv(saida_csv, index=False)
    print(f"✅ CSV salvo com sucesso em: {saida_csv}")

except Exception as e:
    print("❌ Erro ao carregar ou interpretar o arquivo index.pkl:")
    print(e)
