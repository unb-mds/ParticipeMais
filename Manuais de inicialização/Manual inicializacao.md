# Manual de Inicialização Total da Aplicação (Back-end + Front-end)

---

## 🧰 Pré-requisitos

Antes de começar, é necessário ter instalado:

- [Node.js](https://nodejs.org/pt)
- [Python 3](https://www.python.org/)
- [Django](https://www.djangoproject.com/) (`pip install django`)
- [PostgreSQL](https://www.postgresql.org/download/)

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto/backend
```

2. Crie um ambiente virtual:

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. Instale as dependências:

```bash
pip install -r requirements.txt
```

---

## Instalação do Node.js

Para inicializar o React Native, é necessário antes realizar a instalação do Node.js.  
Você pode baixar o instalador no link abaixo:

🔗 [Download do Node.js](https://nodejs.org/pt)

Após a instalação, verifique se o diretório foi adicionado ao **PATH** do sistema (normalmente `C:\Program Files\nodejs\`).  
Caso necessário, reinicie o computador.

Para verificar se o **Node.js** e o **npm** estão funcionando, execute no terminal:

```bash
node -v
npm -v
```

---

## Instalação das Dependências do Projeto

No diretório do seu projeto React Native, instale as dependências usando:

```bash
npm install
```

---

## Adicionando `@react-native-community/cli` às DevDependencies

Se ao rodar o projeto aparecer o aviso:

```
⚠️ react-native depends on @react-native-community/cli for cli commands.
To fix, update your package.json to include:
"devDependencies": {
  "@react-native-community/cli": "latest"
}
```

Adicione o seguinte ao seu `package.json`:

```json
"devDependencies": {
  "@react-native-community/cli": "latest"
}
```

Em seguida, rode novamente:

```bash
npm install
```

---

## Iniciando o Projeto com Expo

Para rodar o aplicativo, execute o comando no terminal:

```bash
npx expo start
```

Um QR code será gerado no terminal.

* Se estiver usando iPhone:
  Baixe o aplicativo **Expo Go** na App Store.
* Abra o **Expo Go** e escaneie o QR code usando o aplicativo.

Se a câmera não reconhecer ou aparecer o erro **"nenhum dado usável foi encontrado"**, tente abrir o servidor Expo no modo tunnel:

```bash
npx expo start --tunnel
```

---

# Manual para Integração do Django com PostgreSQL


## 1. Instale o PostgreSQL

### 🪟 Windows

Baixe e instale o PostgreSQL:
🔗 [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)

Durante a instalação:

* Escolha um nome de **usuário (ex: postgres)**
* Escolha uma **senha**
* Marque a opção para instalar o **pgAdmin**

---

## 2. Instale os pacotes Python

No terminal, digite:

```bash
pip install psycopg2
pip install psycopg2-binary
```

---

## 3. Configure o `settings.py` do Django

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

## 4. Teste a conexão

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
python backend/jogadados.py
```

```bash
python backend/classificar_categorias.py
```

```bash
python backend/keywords_conf.py
```


## ✅ Pronto!

## Agora é só rodar o servidor django

```bash
python manage.py runserver
```


---
## RESUMO FINAL
Baixe o postgre, faça o passo a passo para realizar a integração, faça as migrações e jogue os dados no banco, depois é só inicializar os servidores node e django seguindo os seus respectivos passo a passo (eles tem que estar rodando juntos!)

---



