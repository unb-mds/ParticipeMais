
# Backend Django + DRF

Este backend foi desenvolvido usando Django e Django REST Framework (DRF). Todas as dependências estão listadas no arquivo `requirements.txt`.

---

## 🛠️ Dependências

As dependências necessárias para rodar o backend estão no arquivo:

```
requirements.txt
```

Para instalar manualmente, use:

```bash
pip install -r requirements.txt
```

---

## 🚀 Como rodar o backend

### Opção 1: Rodar localmente (sem Docker)

1. Crie um ambiente virtual Python (recomendado):

```bash
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
```

2. Instale as dependências:

```bash
pip install -r requirements.txt
```

3. Rode as migrations:

```bash
python backend/manage.py migrate
```

4. Inicie o servidor:

```bash
python backend/manage.py runserver
```

O backend estará disponível em: `http://127.0.0.1:8000/`

---

### Opção 2: Rodar com Docker (ambiente de desenvolvimento)

Para facilitar o desenvolvimento, o projeto já conta com um Docker Compose configurado.

1. Suba o ambiente:

```bash
docker compose -f docker-compose.dev.yml up --build
```

2. Rode as migrations dentro do container:

```bash
docker compose -f docker-compose.dev.yml exec backend python3 backend/manage.py migrate
```

3. (Opcional) Crie um superusuário para acessar o admin:

```bash
docker compose -f docker-compose.dev.yml exec backend python3 backend/manage.py createsuperuser
```

O backend estará disponível em: `http://localhost:8001`

