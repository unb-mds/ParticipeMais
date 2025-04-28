# Documento de Arquitetura de Software – Projeto ParticipeMais

## 1. Introdução

Este documento descreve a arquitetura de software planejada para o sistema **ParticipeMais**, um aplicativo voltado para a organização, visualização e interação com dados provenientes da plataforma **Brasil Participativo**. O objetivo é oferecer uma estrutura robusta e escalável para que usuários possam consultar propostas públicas, criar tópicos de discussão, comentar e favoritar conteúdos, utilizando uma experiência similar a plataformas sociais como o Reddit.

O presente documento visa registrar as decisões técnicas, tecnologias escolhidas, estratégias de integração e principais pontos de atenção para o sucesso do projeto.

---

## 2. Visão Geral da Arquitetura

A arquitetura do ParticipeMais será baseada em uma estrutura multicamadas, separando claramente as responsabilidades de apresentação, lógica de negócio, armazenamento e processamento de dados.

### Camadas
- **Frontend (Kotlin)**: Aplicativo Android que permite visualização de propostas, criação de tópicos, comentários e favoritos. Usuários não autenticados apenas visualizam os conteúdos.
- **Backend (Django/Python)**: Responsável pela lógica de negócios, autenticação, gerenciamento das APIs RESTful e integração com o banco de dados.
- **Web Scraper (Python)**: Extração mensal de dados do Brasil Participativo.
- **Módulo de Inteligência Artificial (fase intermediária)**: Agrupamento temático e geração de perguntas.
- **Banco de Dados (PostgreSQL)**: Armazenamento dos dados estruturados.
- **Infraestrutura de Deploy**: Preferencialmente AWS.

### Esquema Simplificado de Comunicação

```
[ Web Scraper (Python) ] → (mensal) → [ Banco de Dados (PostgreSQL) ]

[ Usuário (App Kotlin) ]
    ↓ (requisição REST/JSON)
[ API Backend (Django) ]
    ↓ (consulta SQL)
[ Banco de Dados (PostgreSQL) ]

[Futuramente]
[ IA (LangChain + FAISS) ]
    ↔ (processa dados armazenados)
```

---

## 3. Componentes Principais

### 3.1. Aplicativo Frontend (Kotlin)
- Visualização de propostas
- Criação de tópicos, comentários e favoritos
- Limitação de funcionalidades para usuários não autenticados

### 3.2. Backend (Django - Python)
- APIs RESTful
- Controle de autenticação/autorizacão
- Gerenciamento de dados

### 3.3. Web Scraper (Python)
- Extração mensal de dados públicos
- Inserção automática no banco de dados

### 3.4. Banco de Dados (PostgreSQL)
- Armazenamento de propostas, usuários, interações e documentos

### 3.5. Módulo de Inteligência Artificial
- Clusterização de propostas
- Geração de perguntas temáticas

---

## 4. Comunicação e Fluxo de Dados

- **Web Scraper** coleta dados mensalmente
- **Backend Django** expõe APIs RESTful
- **Frontend Kotlin** consome APIs
- **IA** processa dados armazenados futuramente

---

## 5. Tecnologias e Ferramentas Utilizadas

- **Linguagens**: Python, Kotlin
- **Frameworks/Bibliotecas**: Django, Django REST Framework, Retrofit, BeautifulSoup/Selenium/Scrapy, LangChain + FAISS (futuro)
- **Banco de Dados**: PostgreSQL
- **Versionamento**: Git + GitHub
- **Design**: Figma
- **Infraestrutura**: AWS (preferîncialmente)

---

## 6. Estratégia de Versionamento

### Branches
- `main`: Produção estável
- `develop`: Integração de desenvolvimento
- `feature/nome-da-feature`: Novas funcionalidades
- `hotfix/nome-do-hotfix`: Correções emergenciais

### Políticas de Pull Request
- PRs obrigatórios para merge em `develop` e `main`
- Revisão obrigatória por pelo menos um membro

---

## 7. Considerações sobre Inteligência Artificial

- **Clusterização** de propostas usando NLP
- **Geração de perguntas** temáticas automáticas
- **Ferramentas**: LangChain, FAISS
- **Integração modular** futura

---

## 8. Riscos e Pontos de Atenção

- Mudança na estrutura do site Brasil Participativo pode impactar o scraper
- Crescimento do volume de dados exige otimização
- Integração de IA requer experimentação e ajuste
- Riscos operacionais se a infraestrutura não for definida

---

## 9. Conclusão

O ParticipeMais busca combinar automação, visualização intuitiva e Inteligência Artificial para fortalecer a participação cidadã.

A arquitetura definida prioriza:
- Modularidade
- APIs RESTful seguras e escaláveis
- Tecnologias consolidadas (Django, Kotlin, PostgreSQL)
- Facilidade de manutenção e evolução via GitHub

Este documento será atualizado conforme a evolução do projeto.
