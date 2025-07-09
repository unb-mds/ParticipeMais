# Documento Técnico – Planejamento de Uso de LangChain e FAISS
**Projeto:** ParticipeMais – Brasil Participativo

---

## Objetivo

Investigar e planejar a utilização das ferramentas LangChain e FAISS para organizar e recuperar semanticamente as informações provenientes das propostas, consultas públicas e documentos da plataforma Brasil Participativo. Este estudo servirá de base para a implementação futura de mecanismos de busca inteligente e agentes conversacionais com IA.

---

## 1. O que é LangChain e como pode ser utilizado no projeto

LangChain é uma biblioteca Python voltada para criação de aplicações com modelos de linguagem (LLMs). Ele facilita a construção de fluxos inteligentes envolvendo:

- Leitura de documentos
- Conversão em vetores (embeddings)
- Busca por similaridade
- Geração de respostas com base no contexto

No projeto, o LangChain será usado para:

- Carregar e segmentar documentos (propostas, textos base)
- Criar embeddings (representações numéricas dos textos)
- Conectar com FAISS para buscas vetoriais
- Acionar modelos de linguagem (como o GPT) para gerar respostas personalizadas e contextualizadas ao usuário

---

## 2. O que é FAISS e como pode ser aplicado para indexação vetorial dos dados

FAISS (Facebook AI Similarity Search) é uma biblioteca desenvolvida pelo Facebook para realizar buscas eficientes entre vetores de alta dimensão. É altamente performática e indicada para sistemas de recomendação e busca semântica.

No projeto, será usada para:

- Indexar vetores de documentos
- Buscar, de forma rápida, os textos semanticamente mais próximos a uma pergunta do usuário
- Servir como banco vetorial da aplicação de busca inteligente

---

## 3. Exemplo de uso combinando LangChain + FAISS com base no projeto

Fluxo básico:

1. Usuário faz uma pergunta em linguagem natural
2. LangChain transforma a pergunta em vetor
3. FAISS busca os vetores mais semelhantes nos documentos indexados
4. LangChain invoca um modelo de linguagem (ex: GPT) com os documentos recuperados
5. O modelo responde com base nas propostas e documentos mais relevantes

Exemplo de componente: `RetrievalQA` com `FAISS` como retriever e `ChatOpenAI` como LLM.

---

## 4. Bibliotecas e dependências necessárias

langchain
faiss-cpu (ou faiss-gpu, se for o caso)
sentence-transformers
openai (opcional para embeddings ou GPT)
python-dotenv
tiktoken


---

## 5. Desafios e limitações iniciais

- Custo da API da OpenAI (caso utilizada)
- Limites de token para documentos grandes
- Necessidade de segmentar corretamente os textos longos
- Curva de aprendizado do LangChain e arquitetura baseada em chains
- Armazenamento e versionamento de documentos vetorizados

---

## 6. Estratégias possíveis de integração com o back-end Django/Python

- Criar um endpoint em Django (com `views.py` ou usando FastAPI) que receba a pergunta do usuário
- Chamar um script com LangChain + FAISS para obter a resposta
- Retornar resposta formatada via API REST para o front-end ou para sistemas integrados (ex: Slack, chatbot, painel web)
- Agendar reindexação periódica com Celery, caso os documentos sejam atualizados

---

## 7. Possíveis casos de uso no projeto

- Indexar todas as propostas das conferências usando vetores semânticos
- Criar um buscador inteligente que entende o significado da pergunta, mesmo com palavras diferentes
- Implementar um chat com IA que consulte documentos como regimentos, textos base e propostas
- Permitir navegação entre clusters temáticos com base em similaridade vetorial
- Ajudar a equipe a encontrar trechos relevantes de forma mais rápida e com menor ambiguidade
