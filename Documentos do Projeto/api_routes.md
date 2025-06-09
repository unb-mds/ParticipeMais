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
