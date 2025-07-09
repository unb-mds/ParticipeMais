# Documento de Arquitetura de Software – Projeto ParticipeMais

## 1. Introdução
Este documento descreve a arquitetura de software planejada para o sistema ParticipeMais, um aplicativo voltado para a organização, visualização e interação com dados provenientes da plataforma Brasil Participativo. O objetivo é oferecer uma estrutura robusta e escalável para que usuários possam consultar propostas públicas, criar tópicos de discussão, comentar e favoritar conteúdos, utilizando uma experiência similar a plataformas sociais como o Reddit.

O presente documento visa registrar as decisões técnicas, tecnologias escolhidas, estratégias de integração e principais pontos de atenção para o sucesso do projeto.

## 2. Visão Geral da Arquitetura
A arquitetura do ParticipeMais será baseada em uma estrutura multicamadas, separando claramente as responsabilidades de apresentação, lógica de negócio, armazenamento e processamento de dados.

O sistema será composto pelas seguintes camadas:

- **Frontend (Kotlin)**: Aplicativo Android que permite visualização de propostas, criação de tópicos, comentários e favoritos. Usuários não autenticados poderão apenas visualizar conteúdos, enquanto funcionalidades interativas serão exclusivas para usuários cadastrados.

- **Backend (Django/Python)**: Responsável pela lógica de negócios, autenticação (quando aplicável), gerenciamento das APIs RESTful e integração com o banco de dados PostgreSQL.

- **Web Scraper (Python)**: Serviço automatizado para extração mensal de dados do portal Brasil Participativo, que alimentará o banco de dados interno do sistema.

- **Módulo de Inteligência Artificial (fase intermediária)**: Futuramente, o sistema contará com integração de Machine Learning para realizar agrupamento temático de propostas e geração de perguntas automáticas baseadas nos temas mais relevantes.

- **Banco de Dados (PostgreSQL)**: Armazenará usuários, propostas, tópicos, comentários, favoritos, dados extraídos e informações processadas pela IA.

- **Infraestrutura de Deploy**: O sistema será hospedado preferencialmente em ambiente AWS (Amazon Web Services), garantindo escalabilidade e disponibilidade.

### Esquema Simplificado:
```
Usuário (App Kotlin)
    ↓ (Requisição HTTP/JSON)
API RESTful (Django Backend)
    ↓
Banco de Dados (PostgreSQL)
    ↑
Web Scraper (Python - mensalmente)
Brasil Participativo (Fontes Públicas)
```

## 3. Componentes Principais

### 3.1. Aplicativo Frontend (Kotlin)
- Desenvolvido para Android utilizando Kotlin.
- Interface de apresentação para os usuários finais.
- Permite visualização de propostas, criação de tópicos de discussão, comentários e favoritos.
- Permite navegação mesmo sem autenticação, mas limita ações de interação apenas a usuários cadastrados.

### 3.2. Backend (Django - Python)
- Framework responsável pela gestão da lógica de negócios.
- Implementação de APIs RESTful para comunicação com o aplicativo frontend.
- Controle de autenticação e autorização de usuários.
- Gerenciamento das entidades: propostas, tópicos, comentários, usuários e favoritos.

### 3.3. Web Scraper (Python)
- Serviço separado, programado para rodar mensalmente.
- Realiza extração de dados públicos do portal Brasil Participativo.
- Inserção automática dos dados extraídos no banco de dados interno.

### 3.4. Banco de Dados (PostgreSQL)
- Sistema de gerenciamento de banco de dados relacional.
- Armazena informações relativas a usuários, interações, propostas, tópicos, comentários e dados brutos extraídos.
- Permite consultas eficientes e escaláveis.

### 3.5. Módulo de Inteligência Artificial (implementação futura)
- Aplicará técnicas de NLP para clusterização de propostas.
- Implementará mecanismos automáticos de geração de perguntas baseadas em temas populares.
- Utilizará ferramentas como LangChain e FAISS.

## 4. Comunicação e Fluxo de Dados
A comunicação entre os componentes será baseada em APIs RESTful, utilizando o formato de dados JSON.

### 4.1. Fluxo de Funcionamento Geral

#### Extração de Dados
- O Web Scraper coleta mensalmente novos dados do Brasil Participativo.
- Dados inseridos/atualizados no banco de dados PostgreSQL.

#### Interação do Usuário
- Usuário acessa o app Kotlin e realiza requisições HTTP para o backend Django.
- Usuários autenticados podem criar tópicos, comentar e favoritar.
- Usuários não autenticados apenas visualizam conteúdos.

#### Resposta do Backend
- Backend processa a requisição, acessa o banco e retorna JSON com dados solicitados.

#### Futuro Fluxo de IA
- Dados serão processados periodicamente para organização automática e geração de perguntas.
- Resultados integrados no frontend como sugestões.

### Esquema Simplificado:
```
[ Web Scraper (Python) ] → (mensal) → [ Banco de Dados (PostgreSQL) ]
[ Usuário (App Kotlin) ] ↓ (requisição REST/JSON)
[ API Backend (Django) ] ↓ (consulta SQL)
[ Banco de Dados (PostgreSQL) ]
[Futuramente] [ IA (LangChain + FAISS) ] ↔ (processa dados armazenados)
```

## 5. Tecnologias e Ferramentas Utilizadas

### 5.1. Linguagens de Programação
- **Python**: backend (Django) e web scraper.
- **Kotlin**: aplicativo mobile Android.

### 5.2. Frameworks e Bibliotecas
- **Django**: criação de aplicações web e APIs RESTful.
- **Django REST Framework**: simplifica a criação de APIs.
- **Retrofit**: consumo de APIs REST no Android.
- **BeautifulSoup/Selenium/Scrapy**: desenvolvimento do scraper.
- **LangChain + FAISS**: clusterização e busca semântica via IA (futuro).

### 5.3. Banco de Dados
- **PostgreSQL**: banco de dados relacional robusto e escalável.

### 5.4. Versionamento de Código
- **Git**: controle de versão.
- **GitHub**: hospedagem e colaboração do código-fonte.

### 5.5. Prototipação e Design
- **Figma**: criação de wireframes e fluxos de navegação.

### 5.6. Infraestrutura e Deploy
- **AWS**: hospedagem para backend e banco de dados.

## 6. Estratégia de Versionamento

### 6.1. Estrutura de Branches
- **main**: código estável e de produção.
- **desenvolvimento**: branch de integração para funcionalidades em desenvolvimento.

### 6.2. Políticas de Pull Request
- Todas as contribuições via Pull Requests.
- Revisão obrigatória por ao menos um membro da equipe.

## 7. Considerações sobre Inteligência Artificial

### Aplicações de IA previstas
- **Clusterização de Propostas**: agrupamento automático usando NLP.
- **Geração de Perguntas Temáticas**: perguntas orientadoras a partir de temas populares.

### Ferramentas
- **LangChain**: orquestração e integração modular de fluxos de IA.
- **FAISS**: buscas semânticas eficientes.

A integração de IA será modular, sem impacto crítico nas funcionalidades principais.

## 8. Riscos e Pontos de Atenção

### 8.1. Riscos Técnicos
- Mudança na estrutura do site Brasil Participativo.
- Volume de dados crescente.
- Desafios na integração de IA.

### 8.2. Riscos Operacionais
- Falta de definição de infraestrutura.
- Baixa adesão de usuários cadastrados.

## 9. Conclusão
O projeto ParticipeMais busca oferecer uma solução inovadora para organização e interação com dados de participação cidadã, combinando:

- Modularidade dos componentes.
- Comunicação segura e escalável via APIs RESTful.
- Adoção de tecnologias consolidadas e de alto desempenho.
- Manutenção e evolução facilitadas pela organização de código e versionamento via GitHub.

Este documento será revisado e atualizado conforme novas decisões e avanços no projeto.
