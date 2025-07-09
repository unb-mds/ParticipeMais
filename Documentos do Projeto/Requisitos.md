# Documento de Requisitos de Software - *ParticipeMais*

---

## 1. Introdução
Este documento detalha os **requisitos funcionais e não funcionais** do sistema **ParticipeMais**, um aplicativo voltado para a organização, visualização e interação com dados da plataforma *Brasil Participativo*.  
O objetivo é garantir que o sistema atenda às necessidades dos usuários finais, gestores e equipe técnica, promovendo uma experiência semelhante a plataformas sociais como o **Reddit**.

---

## 2. Objetivo do Sistema
Permitir que cidadãos:

- Consultem propostas públicas
- Criem tópicos de discussão
- Comentem e favoritem conteúdos

Além disso, o sistema deve:

- Coletar dados públicos de forma automatizada
- (Futuramente) Agrupar propostas por temas
- Gerar perguntas com base em temas populares

---

## 3. Requisitos Funcionais

### 3.1. Cadastro e Autenticação

- **RF01**: O sistema deve permitir que usuários se cadastrem e autentiquem via **email** ou integração **Gov.br**  
- **RF02**: Usuários não autenticados poderão apenas visualizar conteúdos  
- **RF03**: Usuários autenticados poderão comentar, favoritar e se inscrever em propostas  

### 3.2. Visualização e Interação com Conteúdos

- **RF04**: O usuário deve poder visualizar propostas públicas extraídas do Brasil Participativo  
- **RF05**: O usuário autenticado pode criar tópicos de discussão relacionados a propostas  
- **RF06**: O usuário autenticado pode comentar em tópicos e propostas  
- **RF07**: O usuário autenticado pode favoritar propostas e tópicos  

### 3.3. Web Scraping e Atualização de Dados

- **RF08**: O sistema deve coletar dados do portal Brasil Participativo em intervalos regulares  
- **RF09**: Os dados extraídos devem ser inseridos e atualizados no banco de dados interno  

### 3.4. Clusterização e Inteligência Artificial *(Futuro)*

- **RF10**: O sistema deve agrupar propostas por temas utilizando técnicas de NLP  
- **RF11**: O sistema deve sugerir perguntas automáticas baseadas em temas populares  

### 3.5. Administração e Moderação

- **RF12**: Administradores devem poder remover conteúdos inadequados  
- **RF13**: O sistema deve registrar logs de ações administrativas  

---

## 4. Requisitos Não Funcionais

- **RNF01**: O sistema deve garantir alta disponibilidade e escalabilidade (preferencialmente na AWS)  
- **RNF02**: O tempo de resposta para operações comuns deve ser inferior a 2 segundos  
- **RNF03**: Dados dos usuários devem estar seguros e em conformidade com a **LGPD**  
- **RNF04**: O sistema deve suportar pelo menos **10.000 usuários simultâneos**  
- **RNF05**: O backend deve expor **APIs RESTful em JSON**  
- **RNF06**: Compatibilidade com dispositivos **Android recentes**  

---

## 5. Restrições

- Frontend em **Kotlin** para Android  
- Backend em **Django (Python)**  
- Banco de dados **PostgreSQL**  
- Web scraper com **BeautifulSoup**, **Scrapy** ou **Selenium**  
- Deploy preferencialmente na **AWS**  
- Versionamento via **GitHub**  

---

## 6. Critérios de Aceitação

- Extração mensal de dados deve ser automática  
- Usuários autenticados podem **criar, comentar e favoritar conteúdos**  
- Apenas administradores podem **remover conteúdos**  
- O sistema deve ser capaz de **agrupar propostas por temas** (com IA)  
- Usuários não autenticados acessam em **modo somente leitura**  

---

## 7. Riscos e Pontos de Atenção

- Alterações no Brasil Participativo podem quebrar o scraper  
- Crescimento de dados pode afetar a performance  
- Integração de IA pode exigir ajustes na infraestrutura  
- Baixa adesão de usuários pode afetar o engajamento  

---

## 8. Glossário

| Termo           | Definição |
|------------------|----------|
| **Proposta**     | Item público coletado do Brasil Participativo |
| **Tópico**       | Discussão criada por usuários sobre uma proposta |
| **Favorito**     | Marcação de interesse em uma proposta ou tópico |
| **Web Scraper**  | Serviço automatizado de coleta de dados públicos |
| **Clusterização**| Agrupamento automático de propostas por semelhança temática |

---

## 9. Referências

- Documento de Arquitetura de Software – *Projeto ParticipeMais*  
- Documentação Django REST Framework  
- Documentação Android/Kotlin  
- Documentação BeautifulSoup, Scrapy, Selenium  
