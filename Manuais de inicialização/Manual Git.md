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