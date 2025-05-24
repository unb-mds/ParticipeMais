````markdown
# Instalação e Inicialização do React Native (Front-end)

## 1️⃣ Instalação do Node.js

Para inicializar o React Native, é necessário antes realizar a instalação do Node.js.  
Você pode baixar o instalador no link abaixo:

🔗 [Download do Node.js](https://nodejs.org/pt)

Após a instalação, verifique se o diretório foi adicionado ao **PATH** do sistema (normalmente `C:\Program Files\nodejs\`).  
Caso necessário, reinicie o computador.

Para verificar se o **Node.js** e o **npm** estão funcionando, execute no terminal:

```bash
node -v
npm -v
````

---

## 2️⃣ Instalação das Dependências do Projeto

No diretório do seu projeto React Native, instale as dependências usando:

```bash
npm install
```

---

## 3️⃣ Adicionando `@react-native-community/cli` às DevDependencies

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

## 4️⃣ Iniciando o Projeto com Expo

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

✅ Pronto! Agora você poderá ver o aplicativo rodando no seu dispositivo.

```
