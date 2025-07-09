
# 🧠 Backend – Participe+  

Este repositório contém o **backend** do projeto **Participe+**, uma aplicação voltada para facilitar o acesso, organização e interação com dados públicos da plataforma [Brasil Participativo](https://brasilparticipativo.presidencia.gov.br).

A API foi desenvolvida utilizando **Django** e **Django REST Framework**, com autenticação JWT e uma arquitetura modular, escalável e preparada para integração futura com **Inteligência Artificial**.

---

## 🔧 Tecnologias Utilizadas

- **Linguagem principal:** Python  
- **Framework Web:** Django  
- **APIs REST:** Django REST Framework  
- **Autenticação:** JWT (JSON Web Token)  
- **Banco de Dados:** PostgreSQL  
- **Scraping:** BeautifulSoup / Scrapy / Selenium  
- **Deploy sugerido:** AWS  
- **Versionamento:** Git + GitHub  

---

## 🧱 Estrutura do Projeto

```bash
backend/
├── api/               # Página inicial, feed, agenda e buscas
├── autenticacao/      # Registro, login, recuperação de senha (JWT)
├── comunidade/        # Comentários, chats, curtidas, gamificação
├── conferencias/      # Eventos públicos, propostas e etapas
├── consultas/         # Consultas públicas e propostas vinculadas
├── planos/            # Planos governamentais e suas metas
├── propostas/         # Propostas públicas e dados coletados
├── project/           # Configurações principais do Django
├── analise.py         # Scripts de análise de dados
├── jogadados.py       # Popular banco com dados brutos
````

---

## 🔌 Endpoints Principais

### 🔐 Autenticação (`/auth/`)

* `login/`, `logout/`, `cadastro/`, `refresh/`
* Recuperação de senha por email

### 🏛 Conferências (`/conferencias/`)

* Listar conferências, propostas, perguntas e etapas

### 🗂 Planos (`/planos/`)

* Detalhar planos e propostas associadas

### 📋 Consultas Públicas (`/consultas/`)

* Listar e detalhar consultas e propostas relacionadas

### 💬 Comunidade (`/comunidade/`)

* Interações sociais: comentários, chats, curtidas
* Pontuação por participação (gamificação)

### 🔍 Descoberta e Pesquisa (`/`)

* Feed, recomendações e pesquisa por temas

### 🛠 Admin (`/admin/`)

* Painel administrativo padrão do Django

> Observação: Algumas rotas exigem autenticação com token JWT. Todas seguem o padrão RESTful.

---

## 🧠 Integração com Inteligência Artificial

Está prevista a integração com os frameworks **LangChain** e **FAISS** para:

* Agrupar propostas por temas (clusterização semântica via NLP)
* Buscar conteúdos por significado, não apenas palavras-chave
* Gerar perguntas automáticas baseadas em temas populares
* Criar um sistema de busca inteligente com IA generativa

---

## 🔄 Atualização de Dados

Um **Web Scraper** escrito em Python coleta mensalmente dados do portal **Brasil Participativo**, e os armazena no banco de dados PostgreSQL. Essa coleta alimenta os módulos de conferências, propostas e consultas públicas.

---

## 🛠 Versionamento e Contribuição

* `main`: código de produção
* `desenvolvimento`: funcionalidades em progresso
* Contribuições devem ser feitas via **Pull Request**, com revisão obrigatória

---

## ⚠️ Riscos e Considerações

* Mudanças na estrutura do site Brasil Participativo podem afetar o scraper
* Crescimento rápido de dados pode impactar performance
* Integração com IA pode exigir refatorações na infraestrutura
* Garantir adesão ativa dos usuários será essencial

---

## 📄 Requisitos Não Funcionais

* APIs REST em JSON
* Tempo de resposta < 2 segundos
* Suporte a +10.000 usuários simultâneos
* Conformidade com a LGPD
* Alta disponibilidade e escalabilidade

---

## 📚 Referências

* Django & Django REST Framework Docs
* PostgreSQL Documentation
* LangChain & FAISS
* Portal Brasil Participativo

---

## 📬 Contato

Para dúvidas ou sugestões, utilize o [GitHub Issues](https://github.com/seurepositorio/issues) ou entre em contato com a equipe de desenvolvimento.

---
