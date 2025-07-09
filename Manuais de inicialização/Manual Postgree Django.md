

# 📘 Manual para Integração do Django com PostgreSQL

## 🎥 Vídeos base:

* [Vídeo 1: Configurando PostgreSQL com Django (YouTube)](https://www.youtube.com/watch?v=XdZtUVmgF-Q)
* [Vídeo 2: Instalando o PostgreSQL e Criando o Primeiro Banco de Dados](https://www.youtube.com/watch?v=L_2l8XTCPAE&t=106s&pp=ygUTcG9zdGdyZXNxbCB0dXRvcmlhbA%3D%3D)

---

## 🧰 Pré-requisitos

* Python e Django instalados
* PostgreSQL instalado

---

## 💾 1. Instale o PostgreSQL

### 🪟 Windows

Baixe e instale o PostgreSQL:
🔗 [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)

Durante a instalação:

* Escolha um nome de **usuário (ex: postgres)**
* Escolha uma **senha**
* Marque a opção para instalar o **pgAdmin**

---

## 📦 2. Instale os pacotes Python

No terminal, digite:

```bash
pip install psycopg2
pip install psycopg2-binary
```

---

## ⚙️ 3. Configure o `settings.py` do Django

Abra o arquivo `settings.py` do seu projeto Django.

### 🔄 Substitua esta configuração:

```python
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }
```

### ✅ Por esta configuração:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',  # Corrigido
        'NAME': 'nome_do_banco',        # Ex: minhaapi_db
        'USER': 'seu_usuario',          # Ex: minhaapi_user ou postgres
        'PASSWORD': 'sua_senha_segura', # A senha definida na instalação
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

---

## 🛠️ 4. Criar banco e usuário (opcional)

Acesse o terminal do PostgreSQL:

```bash
psql -U postgres
```

E execute:

```sql
CREATE DATABASE minhaapi_db;
CREATE USER minhaapi_user WITH PASSWORD 'minha_senha';
GRANT ALL PRIVILEGES ON DATABASE minhaapi_db TO minhaapi_user;
```

---

## 🧪 5. Teste a conexão

Rode as migrações no Django:

```bash
python manage.py makemigrations
python manage.py migrate
```

Se funcionar sem erros, sua integração está feita!

---

```markdown
## 🔄 Atualizando o banco com dados do scraper

Após realizar as migrações com sucesso, é necessário executar o script que insere os dados coletados pelo web scraper no banco de dados.

No terminal, rode:

```bash
python jogadados.py

## ✅ Pronto!

Seu projeto Django agora está usando PostgreSQL como banco de dados, com todos os dados coletados pelo web scraper. Se quiser criar superusuário:

```bash
python manage.py createsuperuser
```

---
