# Backend do Participe+

Este repositório contém o backend da aplicação **Participe+**, um app móvel voltado para participação cidadã. O backend é responsável por fornecer APIs REST seguras, gerenciamento de usuários, controle de propostas, conferências e funcionalidades sociais para o app.

---

## 🚀 O que foi feito

Foi desenvolvido um backend utilizando **Django** e **Django REST Framework**, com autenticação baseada em **JWT (JSON Web Token)** para segurança. A arquitetura é modular e organizada para facilitar manutenção, testes e futuras expansões.

---

## 🔧 Como foi feito
# 📌 Documentação das Rotas da API - ParticipeMais

Este projeto possui várias rotas organizadas por apps no Django, voltadas para funcionalidades como autenticação, conferências, planos, consultas e interações da comunidade (comentários, chats, curtidas). Abaixo, uma breve explicação de cada grupo de rotas:

---

## 🔐 Autenticação (`/auth/`)

- `login/`: Realiza login de um usuário.
- `logout/`: Realiza logout do usuário autenticado.
- `cadastro/`: Cria um novo usuário.
- `refresh/`: Atualiza o token JWT.
- `forgotpassword/`: Envia e-mail com link de recuperação de senha.
- `forgotpassword/confirmtoken/<uidb64>/<token>/`: Verifica se o token de recuperação é válido.
- `forgotpassword/setnewpassword/<uidb64>/<token>/`: Define uma nova senha para o usuário.

---

## 🏛 Conferências (`/conferencias/`)

- `/`: Lista todas as conferências.
- `/<int:pk>/`: Detalha uma conferência específica.
- `/<int:pk>/propostas`: Lista propostas vinculadas à conferência.
- `/<int:pk>/perguntas`: Lista perguntas relacionadas à conferência.
- `/<int:pk>/etapas`: Lista as etapas da conferência.
- `api/`: Rota com funcionalidades adicionais via `ConferenciaViewSet`.

---

## 🗂 Planos (`/planos/`)

- `/`: Lista todos os planos.
- `/<int:pk>/`: Detalha um plano específico.
- `/<int:pk>/propostas/`: Lista propostas associadas a esse plano.

---

## 📋 Consultas Públicas (`/consultas/`)

- `/`: Lista todas as consultas públicas.
- `/<int:pk>`: Detalha uma consulta específica.
- `/<int:pk>/propostas`: Lista as propostas associadas à consulta.

---

## 💬 Comunidade (`/comunidade/`)

- `/`: Página principal da comunidade, lista perguntas com total de comentários.
- `chat/<int:pk>/`: Página de um chat específico (pergunta + comentários).
- `carrosel/`: Lista de comentários para o carrossel da comunidade (exibição visual).
- `chat/<int:chat_pk>/comentarios/<int:comentario_pk>/curtir/`: Endpoint para curtir ou descurtir um comentário.
- `score/`: Exibe a pontuação do usuário na comunidade (gamificação).
- `criachat/`: Criação de um novo chat (pergunta feita pela comunidade).

---

## 🔍 Página Inicial e Descoberta (`/`)

- `/`: Página inicial (`Home`).
- `/descubra/`: Página de descoberta de conteúdo.
- `/pesquisar/`: Pesquisa geral sobre conferências, planos, perguntas, etc.

---

## 🛠 Admin

- `/admin/`: Painel administrativo padrão do Django.

---

## 📌 Observações

- Todas as rotas seguem o padrão REST.
- Algumas rotas exigem autenticação via JWT Token.
- O projeto segue uma arquitetura modular e escalável.

O backend está organizado na seguinte estrutura:

```
backend/
├── api/                  # Implementa a página central do app, com funcionalidades:
│                         # - Descubra: feed e recomendações personalizadas
│                         # - Pesquisar: buscas avançadas por propostas, temas e eventos
│                         # - Favoritos: lista dos conteúdos salvos pelo usuário
│                         # - Agenda: gerenciamento de eventos e compromissos do usuário
│
├── autenticacao/         # Sistema de autenticação com JWT:
│                         # - Registro, login e logout de usuários
│                         # - Renovação de tokens e proteção de rotas
│
├── comunidade/           # Funcionalidades sociais:
│                         # - Interação entre usuários
│                         # - Comentários, avaliações e curtidas
│
├── conferencias/         # Gerenciamento de conferências públicas:
│                         # - Cadastro, listagem e detalhamento de eventos
│                         # - Participação e feedback dos usuários
│
├── consultas/            # Módulo para consultas customizadas:
│                         # - Filtros e buscas otimizadas em bases de dados
│                         # - Endpoints para análises específicas
│
├── planos/               # Gestão e visualização de planos governamentais:
│                         # - Visualização de metas e andamento
│                         # - Integração com propostas relacionadas
│
├── propostas/            # Gestão das propostas enviadas pelos cidadãos:
│                         # - Criação, edição, listagem e análise de propostas
│                         # - Relacionamento com planos e conferências
│
├── project/              # Configurações centrais do Django:
│                         # - Arquivos settings.py, urls.py e wsgi/asgi
│                         # - Configurações de banco de dados, middleware e apps instalados
│
├── analise.py            # Script auxiliar para análises de dados:
│                         # - Processamento de indicadores e métricas
│                         # - Pode ser usado em tarefas agendadas ou análises pontuais
│
├── jogadados.py          # Script para popular o banco de dados com# 📌 Documentação das Rotas da API - ParticipeMais

Este projeto possui várias rotas organizadas por apps no Django, voltadas para funcionalidades como autenticação, conferências, planos, consultas e interações da comunidade (comentários, chats, curtidas). Abaixo, uma breve explicação de cada grupo de rotas:

---

## 🔐 Autenticação (`/auth/`)

- `login/`: Realiza login de um usuário.
- `logout/`: Realiza logout do usuário autenticado.
- `cadastro/`: Cria um novo usuário.
- `refresh/`: Atualiza o token JWT.
- `forgotpassword/`: Envia e-mail com link de recuperação de senha.
- `forgotpassword/confirmtoken/<uidb64>/<token>/`: Verifica se o token de recuperação é válido.
- `forgotpassword/setnewpassword/<uidb64>/<token>/`: Define uma nova senha para o usuário.

---

## 🏛 Conferências (`/conferencias/`)

- `/`: Lista todas as conferências.
- `/<int:pk>/`: Detalha uma conferência específica.
- `/<int:pk>/propostas`: Lista propostas vinculadas à conferência.
- `/<int:pk>/perguntas`: Lista perguntas relacionadas à conferência.
- `/<int:pk>/etapas`: Lista as etapas da conferência.
- `api/`: Rota com funcionalidades adicionais via `ConferenciaViewSet`.

---

## 🗂 Planos (`/planos/`)

- `/`: Lista todos os planos.
- `/<int:pk>/`: Detalha um plano específico.
- `/<int:pk>/propostas/`: Lista propostas associadas a esse plano.

---

## 📋 Consultas Públicas (`/consultas/`)

- `/`: Lista todas as consultas públicas.
- `/<int:pk>`: Detalha uma consulta específica.
- `/<int:pk>/propostas`: Lista as propostas associadas à consulta.

---

## 💬 Comunidade (`/comunidade/`)

- `/`: Página principal da comunidade, lista perguntas com total de comentários.
- `chat/<int:pk>/`: Página de um chat específico (pergunta + comentários).
- `carrosel/`: Lista de comentários para o carrossel da comunidade (exibição visual).
- `chat/<int:chat_pk>/comentarios/<int:comentario_pk>/curtir/`: Endpoint para curtir ou descurtir um comentário.
- `score/`: Exibe a pontuação do usuário na comunidade (gamificação).
- `criachat/`: Criação de um novo chat (pergunta feita pela comunidade).

---

## 🔍 Página Inicial e Descoberta (`/`)

- `/`: Página inicial (`Home`).
- `/descubra/`: Página de descoberta de conteúdo.
- `/pesquisar/`: Pesquisa geral sobre conferências, planos, perguntas, etc.

---

## 🛠 Admin

- `/admin/`: Painel administrativo padrão do Django.

---

## 📌 Observações

- Todas as rotas seguem o padrão REST.
- Algumas rotas exigem autenticação via JWT Token.
- O projeto segue uma arquitetura modular e escalável.
 dados simulados:
│                         # - Facilita testes e demonstrações sem dados reais
│
├── palavras_chaves.py    # Utilitário para extração e manipulação de palavras-chave:
│                         # - Usado para melhorar buscas e recomendações
│
├── troca_ip.py           # Ferramenta para alteração dinâmica de IP:
│                         # - Pode ser usada em contextos de scraping ou balanceamento
│
└── manage.py             # Script padrão do Django para executar comandos:
                          # - Rodar servidor, migrações, shell interativo, testes etc.
```

---


