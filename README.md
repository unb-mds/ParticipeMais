
#  Documentação de Inicialização — ParticipeMais

Este guia descreve os passos necessários para configurar o ambiente local, acessar o código-fonte e iniciar o projeto **ParticipeMais**, desenvolvido com Django e Django REST Framework.

---

## ✅ 1. Instalação do Git

Se ainda não tiver o Git instalado, baixe e instale através do link:

[https://git-scm.com/downloads](https://git-scm.com/downloads)

Após a instalação, abra o terminal (Git Bash, CMD ou PowerShell) e verifique a instalação com:

`git --version`

---

## ✅ 2. Clonando o repositório

Execute:

`git clone [https://github.com/unb-mds/ParticipeMais](https://github.com/unb-mds/ParticipeMais)`

Isso irá baixar o código para uma pasta chamada `ParticipeMais`.

---

## ✅ 3. Configurando seu usuário Git

Se quiser colaborar com o repositório, configure seu nome e email:
```
git config --global user.name "Seu Nome"

git config --global user.email "[[seu@email.com](mailto:seu@email.com)](mailto:seu@email.com)"
```

---

## ✅ 4. Acessando o repositório e gerenciando branches

Entre na pasta do projeto:

`cd ParticipeMais`

Veja as branches disponíveis:

`git branch -a`

Troque para uma branch existente:

`git checkout nome-da-branch`

Ou crie uma branch local a partir da remota:

`git checkout -b nome-da-branch origin/nome-da-branch`

Confirme a branch atual:

`git branch`

---

## ✅ 5. Abrindo no VS Code

Dentro da pasta do projeto, execute:
`
code .`

Caso o comando `code` não funcione, ative no VS Code:

Ctrl + Shift + P → Shell Command: Install 'code' command in PATH

---

## ✅ 6. Criando o ambiente virtual

Crie o ambiente virtual:

`python -m venv venv`

Ative o ambiente:

Para Windows:

`venv\Scripts\activate`

Se o terminal der erro de permissão, abra o PowerShell como administrador e execute:

`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

Depois disso, tente ativar novamente.

---

## ✅ 7. Instalando as dependências

Atualize o pip:

`python -m pip install --upgrade pip`

Instale as bibliotecas necessárias:

```
pip install django

pip install djangorestframework

pip install djangorestframework-simplejwt

pip install django-cors-headers
```

---

## ✅ 8. Iniciando o projeto

Execute o servidor de desenvolvimento com:

`python manage.py runserver`

---

## 📂 Extras

* Repositório: [https://github.com/unb-mds/ParticipeMais](https://github.com/unb-mds/ParticipeMais)
* Frameworks: Django, Django REST Framework
* Autenticação: JWT (com `djangorestframework-simplejwt`)
* CORS: django-cors-headers

---



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

## ✅ Pronto!

Seu projeto Django agora está usando PostgreSQL como banco de dados. Se quiser criar superusuário:

```bash
python manage.py createsuperuser
```

---

Se quiser, posso te ajudar a montar esse mesmo passo a passo direto num `README.md` do seu projeto. Deseja isso?
=======

# 📲 Participe+

**Participe+** é um aplicativo que busca transformar a forma como a população interage com as informações de políticas públicas, tornando propostas, planos e conferências do site [Brasil Participativo](https://brasilparticipativo.presidencia.gov.br/) mais **acessíveis, compreensíveis e interativas** para todos os cidadãos.

---

## 🧠 Visão Geral

A plataforma coleta e organiza os conteúdos públicos do site Brasil Participativo, aplicando **técnicas de Inteligência Artificial** para:

- 📄 **Resumir** textos complexos de políticas públicas;
- 💬 **Gerar perguntas e insights** personalizados com base nos interesses do usuário;
- 🧭 **Organizar conteúdos por temas** como meio ambiente, economia, educação, entre outros.
- ☁️ **Criar nuvens de palavras chaves** de cada proposta.

Além disso, o Participe+ será estruturado como uma **rede social cidadã**, permitindo:

- 👍 Curtidas e salvamento de matérias;
- 🗨️ Comentários e discussões sobre os temas;
- 🔔 Personalização do feed com base nas preferências dos usuários.

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Ferramenta |
|----------|------------|
| Backend  | **Python**, **Django REST Framework** |
| Frontend | **React native** |
| Inteligência Artificial | **LangChain**, **FAISS**, **modelos de linguagem LLM** |
| Coleta de dados | **Web Scraping** com Python |
| Organização dos temas | **Clusterização** com técnicas de NLP |
|  PostgreSQL | Para banco de dados ✨ |

---


## 🔍 Exemplos de Uso

Imagine receber um resumo claro sobre as últimas propostas de educação no Brasil com uma pergunta que estimule a sua reflexão, como:

> "Como essa proposta pode impactar o acesso à educação nas regiões mais remotas?"

E ainda poder interagir com outras pessoas interessadas, comentar e salvar esse conteúdo para consultar depois.

## 🔗 Links Úteis
- [Overview do projeto (Figma)](https://www.figma.com/board/aFnNYsRjCvHpSKfnyjTRZz/Overview-Participe-?node-id=0-1&p=f&t=ClxpcwCEi2E2Fa9L-0)


