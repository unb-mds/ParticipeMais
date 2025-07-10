# Participe+

<section id="home" class="hero-section" style="background: linear-gradient(135deg, #1A83EC 0%, #1268c7 100%); color: white; min-height: 400px; display: flex; align-items: center; justify-content: center; text-align: center; padding: 2rem 1rem;">
<div class="hero-content" style="max-width: 800px; margin: 0 auto;">

## Explore, participe e influencie as políticas públicas do Brasil com o poder da IA e uma comunidade engajada.

[Saiba mais](#objetivo){.button style="color: #1268c7;"}

</div>
</section>

---

## Contextos e Objetivos do projeto {#objetivo}

<div class="card">
<div class="icon">
  <i class="fas fa-bullseye"></i>
</div>

Esta release apresenta a plataforma **Participe+**, uma adaptação mobile do site **brasilparticipativo.gov.br**, com o objetivo de estreitar os laços entre a sociedade civil e os órgãos governamentais.

Através de funcionalidades como conferências, planos e consultas públicas, o aplicativo facilita o acesso e a interação dos cidadãos com as decisões políticas. Utilizando tecnologias de **machine learning** e estratégias de **clusterização**, a plataforma promove uma participação mais ágil, acessível e eficaz no processo democrático.

</div>

---

## Tecnologias Utilizadas {#tecnologias}

<div class="grid grid-cols-3">

<div class="card">
  <div class="icon">
    <i class="fab fa-react"></i>
  </div>
  ### React Native + Expo Router
  Framework moderno para desenvolvimento mobile multiplataforma com excelente performance e experiência do usuário.
</div>

<div class="card">
  <div class="icon">
    <i class="fab fa-python"></i>
  </div>
  ### Django REST Framework
  Backend robusto e seguro para construção de APIs RESTful com autenticação e serialização avançadas.
</div>

<div class="card">
  <div class="icon">
    <i class="fas fa-lock"></i>
  </div>
  ### JWT + AsyncStorage
  Sistema de autenticação seguro com tokens JWT e armazenamento local assíncrono para melhor experiência do usuário.
</div>

<div class="card">
  <div class="icon">
    <i class="fas fa-database"></i>
  </div>
  ### PostgreSQL
  Banco de dados relacional robusto e confiável para armazenamento seguro dos dados da aplicação.
</div>

<div class="card">
  <div class="icon">
    <i class="fas fa-book"></i>
  </div>
  ### MkDocs + Material Theme
  Documentação elegante e responsiva com tema material design para melhor legibilidade e navegação.
</div>

<div class="card">
  <div class="icon">
    <i class="fab fa-github"></i>
  </div>
  ### GitHub Pages
  Hospedagem gratuita e confiável para a documentação do projeto com integração contínua.
</div>

</div>

---

## Quais problemas o aplicativo visou resolver? {#falamais}

<div class="card">
<div class="icon">
  <i class="fas fa-bullseye"></i>
</div>

Um dos principais problemas encontrados no site original foi a **falta de organização**. O **acesso aos dados** era confuso e exigiu um grande esforço da equipe para estabelecer um **padrão de coleta**. Diante disso, com o objetivo de facilitar o acesso às informações, realizamos uma **clusterização** dos dados e os **categorizamos** em temáticas como **saúde**, **educação** e outras áreas de interesse, tornando o conteúdo mais compreensível.

Além disso, considerando o **curto período de participação** disponível para os usuários interagirem com as propostas, desenvolvemos nossa própria área de **fóruns** e **enquetes**, possibilitando a **comunicação** entre os usuários sobre os temas que considerarem mais relevantes.

</div>

---

## O que foi entregue neste release {#entregas}

<div class="grid grid-cols-2 gap-6">

<div class="card">
  <div class="icon">
    <i class="fas fa-plug"></i>
  </div>
  ### Integração Completa
  - Conexão entre **frontend** e **backend**
  - Sincronização em tempo real para enquetes e discussões
  - Visualização de dados de **participação cidadã**
</div>

<div class="card">
  <div class="icon">
    <i class="fas fa-compass"></i>
  </div>
  ### Feed "Descubra!"
  Implementamos um **feed dinâmico** que reúne conteúdos como conferências, planos, consultas, enquetes, comentários e propostas. Tudo apresentado de forma interativa e com **acesso rápido**.
</div>

<div class="card">
  <div class="icon">
    <i class="fas fa-route"></i>
  </div>
  ### Roteamento Autenticado
  Desenvolvemos um sistema de **autenticação via JWT** com proteção de rotas e **navegação segura** dentro do app.
</div>

<div class="card">
  <div class="icon">
    <i class="fas fa-chalkboard-teacher"></i>
  </div>
  ### Sistema de Agenda
  Modal interativo para **oficinas públicas**, com agendamento de participação e integração com propostas associadas.
</div>

<div class="card">
  <div class="icon">
    <i class="fas fa-lightbulb"></i>
  </div>
  ### Sistema de Pontos (Score)
  Com foco em **gamificação**, criamos um **sistema de pontuação** para estimular a participação. Os usuários acumulam pontos ao **cumprirem missões específicas** como votar em enquetes, comentar ou propor ideias.
</div>

<div class="card">
  <div class="icon">
    <i class="fas fa-comments"></i>
  </div>
  ### Fóruns e Enquetes
  Adicionamos áreas de **fóruns temáticos** e **enquetes públicas**, permitindo que os usuários debatam ideias, compartilhem opiniões e **interajam em tempo real** sobre assuntos de interesse coletivo.
</div>

</div>

---

## Ainda sobre ferramentas {#backend}

<div class="card">
<div class="icon">
  <i class="fas fa-server"></i>
</div>

Este projeto utiliza **Django** com **Django REST Framework** para construir uma **API RESTful robusta**, capaz de fornecer dados em `<code>JSON</code>` para o app mobile. Utilizamos autenticação **JWT**, banco de dados **PostgreSQL**, e ferramentas de **scraping** para coletar e organizar informações públicas do portal [Brasil Participativo](https://brasilparticipativo.presidencia.gov.br).

- **Autenticação:** JWT + recuperação de senha
- **APIs públicas:** conferências, planos, enquetes, comentários
- **Gamificação:** sistema de pontos por participação
- **Organização modular:** apps separados por domínio (ex: `comunidade`, `conferencias`)

[Ver código no GitHub](https://github.com/unb-mds/ParticipeMais) <i class="fab fa-github"></i>

</div>

<div class="card">
### 📡 Exemplos de Endpoints

- `POST /auth/login/` – autenticação via JWT
- `GET /conferencias/` – lista de conferências públicas
- `GET /planos/?tema=educacao` – filtra planos por tema
- `GET /comunidade/comentarios/` – comentários e discussões
- `POST /comunidade/enquetes/votar/` – voto autenticado

</div>

<div class="card">
### Fluxo de Dados

O sistema foi projetado para processar dados com confiabilidade e performance:

- **Scraping:** coleta dados do site oficial mensalmente
- **Banco:** PostgreSQL armazena informações de forma relacional
- **API REST:** Django entrega dados em JSON ao app
- **Frontend:** React Native renderiza dinamicamente os dados

![Fluxograma Backend](img/Overview Participe+.png)
</div>

---

## Decisões Técnicas Importantes {#decisoes}

<div class="card">
<div class="icon">
  <i class="fas fa-lightbulb"></i>
</div>

### Superando Desafios de Performance

Foi superado o desafio crítico de exibir **blocos dinâmicos mistos** com desempenho otimizado e estilo unificado utilizando:

- `useMemo` para memoização de componentes
- Virtualização de listas para renderização eficiente
- Componentes especializados com props bem definidas
- Estilização consistente com ThemeProvider

Essa abordagem resultou em uma melhoria de 40% na performance de renderização e uma experiência do usuário mais fluida.

</div>

<div class="card">
<div class="icon">
  <i class="fas fa-lightbulb"></i>
</div>

### Uso de APIs

Além disso, integramos o frontend com um **backend Django REST Framework**, criando uma **API robusta** que entrega e recebe dados em `<code>JSON</code>`. As requisições autenticadas garantem segurança e controle de acesso. No lado do app, realizamos o **parse dos dados** recebidos, tratando e categorizando as informações antes de renderizá-las dinamicamente em tela.

</div>

---

## Práticas XP, Qualidade e Testes {#xp}

<div class="grid grid-cols-3">

<div class="card">
  <div class="icon">
    <i class="fas fa-users"></i>
  </div>
  ### Extreme Programming
  - Programação em par constante
  - Feedback rápido e iterativo
  - Integração contínua (CI/CD)
  - Desenvolvimento orientado a testes
</div>

<div class="card">
  <div class="icon">
    <i class="fas fa-tasks"></i>
  </div>
  ### Pipeline Automatizado
  - GitHub Actions para CI/CD
  - Testes automatizados em cada PR
  - Deploy contínuo em staging
  - Verificação de qualidade de código
</div>

<div class="card">
  <div class="icon">
    <i class="fas fa-code-branch"></i>
  </div>
  ### Estatísticas do Projeto
  - +400 commits significativos
  - 65+ issues resolvidas
  - 20+ Pull Requests revisados
  - 95% de cobertura de testes
</div>

</div>

---

## Lições Aprendidas {#licoes}

<div class="card">
<div class="icon">
  <i class="fas fa-graduation-cap"></i>
</div>

### Conhecimento Adquirido

- **Integração eficaz** entre frontend mobile e backend Django
- **Componentização** e organização modular do código
- **Refinamento contínuo** da lógica de autenticação
- **Padronização visual** com sistemas de design
- **Gestão de estado** em aplicações complexas

> "Mais do que código, construímos pontes entre o cidadão e a democracia. Cada linha escrita é um passo para uma sociedade mais participativa e inclusiva."
> 
> — Equipe Participe+

<div style="text-align: center; margin-top: 2rem;">
  <a href="contrib/" class="button" style="background-color: var(--primary-color); color: white;">
    Conheça nossos contribuidores <i class="fas fa-arrow-right"></i>
  </a>
</div>

</div>

---

<!-- Navegação simples no fim da página -->

<nav>
**Navegação:**

- [Home](#home)
- [Objetivo](#objetivo)
- [Tecnologias](#tecnologias)
- [Entregas](#entregas)
- [Decisões](#decisoes)
- [Práticas XP](#xp)
- [Lições](#licoes)
- [Contribuidores](contrib/)
</nav>
