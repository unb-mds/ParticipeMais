Documento de Requisitos de Software - ParticeMais

1. Introdução
Este documento detalha os requisitos funcionais e não funcionais do sistema ParticipeMais, um aplicativo voltado para a organização, visualização e interação com dados provenientes da plataforma Brasil Participativo. O objetivo é garantir que o sistema atenda às necessidades dos usuários finais, gestores e equipe técnica, promovendo uma experiência semelhante a plataformas sociais como o Reddit.

2. Objetivo do Sistema
Permitir que cidadãos consultem propostas públicas, criem tópicos de discussão, comentem e favoritem conteúdos, além de fornecer mecanismos para coleta automatizada de dados públicos e, futuramente, funcionalidades inteligentes de agrupamento temático e geração de perguntas.

3. Requisitos Funcionais


3.1. Cadastro e Autenticação

* RF01: O sistema deve permitir que usuários se cadastrem e autentiquem via email ou integração Gov.br.

* RF02: Usuários não autenticados poderão apenas visualizar conteúdos.

* RF03: Usuários autenticados poderão comentar, favoritar e se inscrever em propostas.


3.2. Visualização e Interação com Conteúdos

* RF04: O usuário deve poder visualizar propostas públicas extraídas do Brasil Participativo.

* RF05: O usuário autenticado pode criar tópicos de discussão relacionados a propostas.

* RF06: O usuário autenticado pode comentar em tópicos e propostas.

* RF07: O usuário autenticado pode favoritar propostas e tópicos.


3.3. Web Scraping e Atualização de Dados

* RF08: O sistema deve coletar dados do portal Brasil Participativo em intervalos regulares de tempo, de forma automatizada.

* RF09: Os dados extraídos devem ser inseridos e atualizados no banco de dados interno.


3.4. Clusterização e Inteligência Artificial (Futuro)

* RF10: O sistema deve agrupar propostas por temas utilizando técnicas de NLP.

* RF11: O sistema deve sugerir perguntas automáticas baseadas em temas populares.


3.5. Administração e Moderação:
* RF12: Administradores devem poder remover conteúdos inadequados.

* RF13: O sistema deve registrar logs de ações administrativas.

4. Requisitos Não Funcionais:
* RNF01: O sistema deve garantir alta disponibilidade e escalabilidade, preferencialmente em ambiente AWS.

* RNF02: O tempo de resposta para operações comuns deve ser inferior a 2 segundos.

* RNF03: Os dados dos usuários e interações devem ser armazenados de forma segura e em conformidade com a LGPD.

* RNF04: O sistema deve suportar pelo menos 10.000 usuários simultâneos.

* RNF05: O backend deve expor APIs RESTful em JSON.

* RNF06: O sistema deve ser compatível com dispositivos Android recentes.


5. Restrições:
* O frontend será desenvolvido em Kotlin para Android.

* O backend será implementado em Django (Python).

* O banco de dados será PostgreSQL.

* O web scraper será desenvolvido em Python, utilizando BeautifulSoup, Scrapy ou Selenium.

* O deploy será realizado preferencialmente em AWS.

* O versionamento do código será feito via GitHub.


6. Critérios de Aceitação
* A extração mensal de dados deve ser realizada automaticamente sem intervenção manual.

* Usuários autenticados devem conseguir criar, comentar e favoritar conteúdos.
  
* Apenas administradores podem remover conteúdos.
  
* O sistema deve ser capaz de agrupar propostas por temas (quando o módulo de IA estiver implementado).
  
* O aplicativo deve funcionar em modo somente leitura para usuários não autenticados.


7. Riscos e Pontos de Atenção
* Mudanças na estrutura do site Brasil Participativo podem exigir ajustes no scraper.

* Crescimento do volume de dados pode impactar a performance e exigir otimizações.

* Integração de IA pode demandar ajustes na infraestrutura e no modelo de dados.

* Baixa adesão de usuários pode comprometer o engajamento da plataforma.


8. Glossário
* Proposta: Item público coletado do Brasil Participativo.

* Tópico: Discussão criada por usuários sobre uma proposta.

* Favorito: Marcação de interesse em uma proposta ou tópico.

* Web Scraper: Serviço automatizado de coleta de dados públicos.

* Clusterização: Agrupamento automático de propostas por semelhança temática.


9. Referências
Documento de Arquitetura de Software – Projeto ParticipeMais
Documentação Django REST Framework
Documentação Android/Kotlin
Documentação BeautifulSoup, Scrapy, Selenium
