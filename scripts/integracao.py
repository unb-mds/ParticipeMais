import pandas as pd
import re
import unicodedata
import nltk
from nltk.corpus import stopwords

# 🔽 Baixar stopwords do NLTK se necessário
nltk.download('stopwords')
stop_words = set(stopwords.words('portuguese'))

# 🔧 Função de limpeza
def limpar_texto(texto):
    if pd.isnull(texto):
        return ""
    texto = str(texto).lower()
    texto = re.sub(r"http\S+", "", texto)
    texto = re.sub(r"[^a-záéíóúàèìòùâêîôûãõç\s]", "", texto)
    texto = re.sub(r"\s+", " ", texto)
    palavras = texto.split()
    palavras = [p for p in palavras if p not in stop_words]
    texto = " ".join(palavras)
    texto = ''.join(c for c in unicodedata.normalize('NFKD', texto)
                    if not unicodedata.combining(c))
    return texto

# 📂 Carregar o CSV
df = pd.read_csv("../WebScraper/resultados/conferencias/etapas.csv")

# 👁️ Verificar colunas
print("Colunas encontradas no DataFrame:")
for i, col in enumerate(df.columns):
    print(f"{i}: {col[:80]}")

# ✅ Renomear a coluna 3 para 'encerradas_brutas'
coluna_texto = df.columns[3]
df.rename(columns={coluna_texto: "etapas_brutas"}, inplace=True)

# 📄 Tratar como lista de strings (avaliar se necessário)
import ast
df["etapas_lista"] = df["etapas_brutas"].apply(ast.literal_eval)  # converte de string para lista

# 🧹 Aplicar pré-processamento em cada item da lista
df["etapas_processadas"] = df["etapas_lista"].apply(
    lambda lista: [limpar_texto(p) for p in lista]
)

# 💾 Salvar como novo CSV
df[["etapas_processadas"]].explode("etapas_processadas").to_csv("etapas_limpa.csv", index=False)
print("✅ Arquivo 'etapas_limpa.csv' salvo com sucesso!")
