# 🛠️ Guia para Rodar o Projeto Localmente

Bem-vindo(a)! 👋  
Este guia foi criado para te ajudar a rodar o projeto localmente, de forma prática e sem mistérios. Aqui vamos passar pelos passos de instalação, configuração do backend (Django), frontend (React Native com Expo), banco de dados (PostgreSQL), além de testes e integração.

Se você chegou até aqui, parabéns! 🎉 Bora colocar tudo pra funcionar?

---

## ✅ Requisitos Gerais

Antes de começar, certifique-se de ter os seguintes itens instalados:

- **Python** (>= 3.10)
- **Node.js** (>= 18)
- **npm** ou **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **PostgreSQL** (>= 13)
- **Docker e Docker Compose** (opcional, mas recomendado)
- **Git**

---

## ⚙️ Passo a Passo para Rodar o Backend (Django)

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

4. Configure o banco (veja seção abaixo) e as variáveis de ambiente.

5. Aplique as migrações e crie um superusuário:

```bash
python manage.py migrate
python manage.py createsuperuser
```

6. Rode o servidor local:

```bash
python manage.py runserver
```

---

## 📱 Passo a Passo para Rodar o Frontend (React Native com Expo)

1. Acesse a pasta do frontend:

```bash
cd ../mobile
```

2. Instale as dependências:

```bash
npm install
# ou
yarn
```

3. Crie um arquivo `.env` com a URL do backend:

```env
API_URL=http://localhost:8000
```

4. Inicie o projeto com o Expo:

```bash
expo start
```

> Você pode escanear o QR Code com o app Expo Go no seu celular 📱

---

## 🗄️ Como Configurar o Banco PostgreSQL

Você pode usar PostgreSQL localmente ou via Docker.

### Usando Docker (recomendado):

```bash
docker-compose up -d
```

### Manualmente:

1. Crie o banco de dados:

```bash
createdb nome_do_banco
```

2. Atualize suas variáveis `.env` com:

```env
DB_NAME=nome_do_banco
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
```

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend com os seguintes campos:

```env
SECRET_KEY=sua-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=nome_do_banco
DB_USER=usuario
DB_PASSWORD=senha
DB_HOST=localhost
DB_PORT=5432
```

---

## 🔄 Comandos de Migração e Criação de Superusuário

- Aplicar migrações:
  ```bash
  python manage.py migrate
  ```

- Criar superusuário:
  ```bash
  python manage.py createsuperuser
  ```

- Popular banco com dados de exemplo (se houver):
  ```bash
  python manage.py loaddata dados_iniciais.json
  ```

---

## 🧪 Rodando Testes no Backend

Para executar os testes automatizados do Django:

```bash
python manage.py test
```

---

## 🔗 Como Garantir que a Integração Está Funcionando

1. Inicie o backend (servidor em `http://localhost:8000`)
2. Inicie o frontend com o Expo
3. Acesse uma funcionalidade que consuma a API (ex: login, lista de itens)
4. Verifique no terminal do backend se as requisições estão chegando
5. ⚠️ Caso esteja usando um dispositivo físico (como celular), certifique-se de usar o IP local da sua máquina, por exemplo:

```env
API_URL=http://192.168.0.X:8000
```

---

## 📘 Dica Final

Se tudo der certo, você verá o app funcionando em tempo real. Caso algo falhe, sem pânico!  
Revise os passos com calma e, se precisar, abra uma issue ou fale com a gente. Estamos aqui para construir isso juntos 💙

---

_Fique à vontade para contribuir com melhorias neste guia!_
