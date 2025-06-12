````markdown
# 🧠 Cluster de Propostas com NLP + IA

Este repositório contém o pipeline de **pré-processamento textual**, **geração de embeddings semânticos** e **armazenamento vetorial com FAISS** para organizar as propostas do site **Brasil Participativo** por similaridade temática.

Nosso objetivo é aplicar **Machine Learning e NLP** para agrupar automaticamente as propostas em **temas**, facilitando análises qualitativas e navegação por parte da sociedade civil, pesquisadores e gestores públicos.

---

## 📌 Etapas do Pipeline

```text
1. Web scraping das propostas  ✅
2. Pré-processamento textual    ✅
3. Geração de embeddings        ✅
4. Armazenamento vetorial (FAISS) ✅
5. Clusterização e visualização (em desenvolvimento)
6. Frontend e navegação interativa (em breve)
````

---

## ⚙️ Como instalar as dependências

Este projeto usa um ambiente Python com bibliotecas específicas para NLP e IA.

### ▶️ 1. Crie um ambiente virtual (recomendado)

```bash
python -m venv venv
source venv/bin/activate    # Linux/Mac
venv\Scripts\activate       # Windows
```

### ▶️ 2. Instale as dependências do projeto

```bash
pip install -r requirements.txt
```

> 💡 Em sistemas Windows, pode ser necessário editar o `requirements.txt` e substituir `faiss-cpu` por `faiss-cpu-windows`.

---

## 🧹 Etapa 1 — Pré-processamento Textual (`integracao.py`)

Esta etapa transforma os textos brutos em versões padronizadas e limpas, prontas para processamento semântico.

### ✨ O que é feito:

* Remoção de stopwords, pontuação e links
* Padronização para caixa baixa
* Remoção de acentos
* Extração de listas textuais de colunas que armazenam múltiplas propostas

### 📁 Entrada esperada:

Um CSV contendo os textos brutos das propostas (como listas de strings):

```
['Proposta 1', 'Proposta 2', '...']
```

### ▶️ Como executar

```bash
python integracao.py
```

### 🧾 Resultado:

Gera o arquivo `propostas_limpa.csv`, onde cada linha contém **uma proposta já pré-processada** na coluna `propostas_processadas`.

Como o projeto possui **múltiplas áreas temáticas e ciclos de scraping distintos**, os códigos de processamento são executados **várias vezes** com diferentes conjuntos de dados. Para lidar com isso, adotamos uma estratégia **manual e descritiva**: antes de rodar o script, definimos **explicitamente qual arquivo será processado**, e ao final, salvamos o resultado com **nomes distintos** (ex: `propostas_meio_ambiente.csv`, `propostas_educacao.csv`), mantendo clareza e controle sobre os dados de saída.


---

## 🧠 Etapa 2 — Geração de Embeddings com LangChain (`gerar_embeddings.py`)

Nesta etapa, usamos o modelo `all-MiniLM-L6-v2` da HuggingFace (via LangChain) para transformar os textos em **vetores semânticos** e armazená-los com FAISS.

### ✨ O que é feito:

* Carregamento do CSV limpo
* Vetorização dos textos com LangChain
* Criação de um índice FAISS
* Salvamento local para reuso posterior

### 📁 Entrada esperada:

```
propostas_limpa.csv
```

Coluna: `propostas_processadas`

### ▶️ Como executar

```bash
python gerar_embeddings.py
```

### 🧾 Resultado:

Cria a pasta `faiss_index/` com o índice vetorial salvo, roda-ser o código de acordo com a quantidade de arquivos 'csv' que se deseja processar. Esse índice pode ser usado para:

* 🔍 Buscar propostas semelhantes por tema
* 📊 Aplicar clusterização temática (KMeans, HDBSCAN)
* 💬 Alimentar um chatbot com IA baseado em busca semântica (LangChain RAG)

---

## 📁 Estrutura sugerida do projeto

```
📦 cluster-propostas/
├── integracao.py                # Pré-processamento textual
├── gerar_embeddings.py          # Geração de embeddings + FAISS
├── propostas_limpa.csv          # Textos limpos prontos para vetorização
├── faiss_index/                 # Armazenamento dos vetores
├── README.md                    # Documentação do projeto
├── requirements.txt             # Lista de dependências
```

---

## 🚀 Próximos passos

* [ ] Aplicar clusterização com KMeans e HDBSCAN
* [ ] Visualizar clusters com UMAP e WordClouds
* [ ] Criar uma interface interativa para explorar os temas (Streamlit, React ou Jetpack Compose)
* [ ] Lançar um MVP do sistema "Participa+" para experimentação cidadã

```