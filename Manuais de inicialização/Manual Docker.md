
# 📦 Projeto Django + Docker

Este repositório contém uma aplicação Django configurada com Docker para facilitar o desenvolvimento e a execução em ambiente de produção.

---

## 🚀 Ambientes disponíveis

- **Desenvolvimento**: disponível em `http://localhost:8001`
- **Produção**: disponível em `http://localhost:8000`

---

## 🛠️ Requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## 👨‍💻 Ambiente de Desenvolvimento

### 1. Subir o ambiente

```bash
docker compose --env-file .env -f docker-compose.dev.yml up --build

```

A aplicação estará disponível em:  
🔗 `http://localhost:8001`

---

### 2. Rodar as migrations

```bash
docker compose -f docker-compose.dev.yml exec backend python3 backend/manage.py migrate
```

---

### 3. (Opcional) Criar um superusuário

```bash
docker compose -f docker-compose.dev.yml exec backend python3 backend/manage.py createsuperuser
```

---

## 🏭 Ambiente de Produção

### 1. Construir a imagem

```bash
docker build -f Dockerfile.backend.prod -t backend/prod:v1 .
```

---

### 2. Rodar o container

```bash
docker run -d -p 8000:8000 --name backend-prod-v1 backend/prod:v1
```

A aplicação estará disponível em:  
🔗 `http://localhost:8000`

---

## 📂 Estrutura do Projeto (resumo)

```bash
.
├── backend/
│   ├── manage.py
│   └── ...
├── Dockerfile.backend.prod
├── docker-compose.dev.yml
└── requirements.txt
```

---

## 📄 Notas

- Certifique-se de que as portas 8000 e 8001 estejam livres.
- Use `docker ps` para verificar os containers ativos.
- Use `docker logs <nome_container>` para verificar os logs de execução.