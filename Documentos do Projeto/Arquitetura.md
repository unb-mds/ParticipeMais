Documento de Arquitetura de Software – Projeto ParticipeMais

1. Introdução
Este documento descreve a arquitetura de software planejada para o sistema ParticipeMais, um aplicativo voltado para a organização, visualização e interação com dados provenientes da plataforma Brasil Participativo. O objetivo é oferecer uma estrutura robusta e escalável para que usuários possam consultar propostas públicas, criar tópicos de discussão, comentar e favoritar conteúdos, utilizando uma experiência similar a plataformas sociais como o Reddit.
O presente documento visa registrar as decisões técnicas, tecnologias escolhidas, estratégias de integração e principais pontos de atenção para o sucesso do projeto.
2. Visão Geral da Arquitetura
A arquitetura do ParticipeMais será baseada em uma estrutura multicamadas, separando claramente as responsabilidades de apresentação, lógica de negócio, armazenamento e processamento de dados.
O sistema será composto pelas seguintes camadas:
Frontend (Kotlin): Aplicativo Android que permite visualização de propostas, criação de tópicos, comentários e favoritos. Usuários não autenticados poderão apenas visualizar conteúdos, enquanto funcionalidades interativas serão exclusivas para usuários cadastrados.


Backend (Django/Python): Responsável pela lógica de negócios, autenticação (quando aplicável), gerenciamento das APIs RESTful e integração com o banco de dados PostgreSQL.


Web Scraper (Python): Serviço automatizado para extração mensal de dados do portal Brasil Participativo, que alimentará o banco de dados interno do sistema.


Módulo de Inteligência Artificial (fase intermediária): Futuramente, o sistema contará com integração de Machine Learning para realizar agrupamento temático de propostas e geração de perguntas automáticas baseadas nos temas mais relevantes.


Banco de Dados (PostgreSQL): Armazenará usuários, propostas, tópicos, comentários, favoritos, dados extraídos e informações processadas pela IA.


Infraestrutura de Deploy: O sistema será hospedado preferencialmente em ambiente AWS (Amazon Web Services), garantindo escalabilidade e disponibilidade.


Usuário (App Kotlin)
        		↓ (Requisição HTTP/JSON)
API RESTful (Django Backend)
       		↓
Banco de Dados (PostgreSQL)
        		↑
Web Scraper (Python - mensalmente)
Brasil Participativo (Fontes Públicas)


3. Componentes Principais
O sistema será dividido em componentes principais que interagem entre si para garantir o funcionamento completo da aplicação. A seguir, detalham-se os componentes previstos:
3.1. Aplicativo Frontend (Kotlin)
Desenvolvido para Android utilizando Kotlin.


Interface de apresentação para os usuários finais.


Permite visualização de propostas, criação de tópicos de discussão, comentários e favoritos.


Permite navegação mesmo sem autenticação, mas limita ações de interação apenas a usuários cadastrados.


3.2. Backend (Django - Python)
Framework responsável pela gestão da lógica de negócios.


Implementação de APIs RESTful para comunicação com o aplicativo frontend.


Controle de autenticação e autorização de usuários.


Gerenciamento das entidades: propostas, tópicos, comentários, usuários e favoritos.


3.3. Web Scraper (Python)
Serviço separado, programado para rodar mensalmente.


Realiza extração de dados públicos do portal Brasil Participativo: propostas, consultas públicas, enquetes, textos "Sobre" e documentos associados.


Inserção automática dos dados extraídos no banco de dados interno.


3.4. Banco de Dados (PostgreSQL)
Sistema de gerenciamento de banco de dados relacional.


Armazena todas as informações relativas a usuários, interações, propostas, tópicos, comentários e dados brutos extraídos.


Permite consultas eficientes e escaláveis.


3.5. Módulo de Inteligência Artificial (implementação futura)
Será responsável por aplicar técnicas de NLP (Processamento de Linguagem Natural) para clusterização de propostas.


Implementará mecanismos automáticos de geração de perguntas baseadas em temas populares.


Utilizará ferramentas como LangChain e FAISS, conforme estudo posterior.



4. Comunicação e Fluxo de Dados
A comunicação entre os componentes será baseada em APIs RESTful, utilizando o formato de dados JSON para troca de informações entre o aplicativo e o servidor.
4.1. Fluxo de Funcionamento Geral
Extração de Dados


O Web Scraper coleta mensalmente novos dados do Brasil Participativo.


Esses dados são inseridos e atualizados no banco de dados PostgreSQL através de processos backend.


Interação do Usuário


O usuário acessa o aplicativo Kotlin e realiza requisições HTTP para as APIs disponibilizadas pelo backend Django.


Caso esteja autenticado, poderá criar tópicos, comentar e favoritar conteúdos.


Usuários não autenticados terão acesso apenas à visualização das propostas e tópicos.


Resposta do Backend


O backend Django processa a requisição, acessa o banco de dados, e retorna uma resposta em JSON contendo os dados solicitados (propostas, tópicos, enquetes, perguntas, etc.).


Futuro Fluxo de IA


Dados armazenados serão processados periodicamente por módulos de IA para organização automática de conteúdo e geração de perguntas orientadoras.


Os resultados deste processamento serão disponibilizados no frontend como novas sugestões de navegação ou consulta.

Esquema Simplificado de Comunicação
[ Web Scraper (Python) ] → (mensal) → [ Banco de Dados (PostgreSQL) ]

[ Usuário (App Kotlin) ]
   	 ↓ (requisição REST/JSON)
[ API Backend (Django) ]
    	↓ (consulta SQL)
[ Banco de Dados (PostgreSQL) ]

[Futuramente]
[ IA (LangChain + FAISS) ]
    ↔ (processa dados armazenados)


5. Tecnologias e Ferramentas Utilizadas
O desenvolvimento do ParticipeMais utilizará um conjunto de tecnologias escolhidas pela equipe de projeto para garantir robustez, escalabilidade e facilidade de manutenção. Abaixo estão listadas as tecnologias e ferramentas principais:
5.1. Linguagens de Programação
Python: para o backend (Django) e desenvolvimento do web scraper.


Kotlin: para o desenvolvimento do aplicativo mobile Android.


5.2. Frameworks e Bibliotecas
Django: framework para criação de aplicações web, responsável pela implementação das APIs RESTful e lógica de negócios.


Django REST Framework: biblioteca para simplificar a criação de APIs RESTful em Django.


Retrofit: biblioteca Android para consumo de APIs REST, prevista para integração no frontend Kotlin.


BeautifulSoup/Selenium/Scrapy: bibliotecas Python previstas para o desenvolvimento do scraper automatizado.


LangChain + FAISS (futuramente): integração para mecanismos de clusterização e busca semântica via IA.


5.3. Banco de Dados
PostgreSQL: banco de dados relacional utilizado para armazenamento de dados estruturados, com suporte a consultas complexas e grande escalabilidade.


5.4. Versionamento de Código
Git: sistema de controle de versão.


GitHub: plataforma de hospedagem e colaboração do código-fonte.


5.5. Prototipação e Design
Figma: ferramenta de prototipação e criação dos wireframes e fluxos de navegação do aplicativo.


5.6. Infraestrutura e Deploy
AWS (Amazon Web Services) (preferencialmente): ambiente de hospedagem para o backend e banco de dados, visando alta disponibilidade e escalabilidade futura.



6. Estratégia de Versionamento
O controle de versões do projeto ParticipeMais seguirá um fluxo baseado no uso de Git e GitHub, estruturado para permitir organização, rastreamento e colaboração eficiente entre os desenvolvedores.
6.1. Estrutura de Branches
main:


Contém a versão de produção e estável do projeto.


Só receberá código que tenha sido testado e validado.


desenvolvimento:


Branch de integração para funcionalidades em desenvolvimento.


Todas as novas features e correções são integradas primeiro aqui.



6.2. Políticas de Pull Request
Todas as contribuições devem ser feitas via Pull Requests (PRs).


PRs serão obrigatórios para mudanças significativas a partir de fases intermediárias do projeto.


Revisão por pelo menos um membro da equipe antes da aprovação para develop ou main.

7. Considerações sobre Inteligência Artificial
O ParticipeMais prevê, em uma fase intermediária do projeto, a integração de recursos de Inteligência Artificial para aprimorar a organização e a consulta de dados.
As aplicações de IA previstas são:
Clusterização de Propostas: Agrupar automaticamente propostas por similaridade temática utilizando técnicas de Processamento de Linguagem Natural (NLP).


Geração de Perguntas Temáticas: Criação automática de perguntas orientadoras a partir dos temas mais discutidos nas propostas, sem interação direta tipo chatbot.


As ferramentas propostas para essa fase são:
LangChain: Para orquestração do processamento e integração modular dos fluxos de IA.


FAISS: Para criação de bancos de vetores que possibilitem buscas semânticas eficientes dentro do conjunto de dados.


A integração da IA ocorrerá de forma modular, permitindo a ativação sem impacto crítico nas funcionalidades principais da aplicação.

8. Riscos e Pontos de Atenção
8.1. Riscos Técnicos
Mudança na estrutura do site Brasil Participativo: Pode quebrar o funcionamento do web scraper.


Volume de dados crescente: Necessitará de ajustes no banco de dados e otimizações de consulta.


Desafios na Integração de IA: A escolha e parametrização dos modelos de NLP podem exigir ajustes finos e testes constantes.


8.2. Riscos Operacionais
Falta de definição de infraestrutura: Caso o deploy em AWS não seja viabilizado, será necessário planejar uma alternativa rapidamente.


Baixa adesão de usuários cadastrados: Pode limitar o uso das funcionalidades de interação (comentários, favoritos, criação de tópicos).



9. Conclusão
O projeto ParticipeMais busca oferecer uma solução inovadora de organização e interação com os dados de participação cidadã do Brasil, combinando automação de coleta, visualização intuitiva e aplicação futura de Inteligência Artificial.
A arquitetura definida prioriza:
Modularidade dos componentes (backend, frontend, scraper, IA)


Comunicação segura e escalável via APIs RESTful


Adoção de tecnologias consolidadas e de alto desempenho (Django, Kotlin, PostgreSQL)


Manutenção e evolução facilitadas pela organização de código e versionamento via GitHub.


Este documento será revisado e atualizado conforme novas decisões e avanços no projeto.

