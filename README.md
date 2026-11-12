# Ônibus SP — Mobilidade Urbana

Aplicativo mobile em **React Native (Expo)** que consome a **API Olho Vivo da SPTrans** para ajudar o cidadão a se deslocar de ônibus em São Paulo, com persistência local em **AsyncStorage**.

Disciplina: Cross-Platform Application Development — Ciência da Computação (FIAP)

## Integrantes

| Nome completo | RM |
|---|---|
| NOME DO INTEGRANTE 1 | RM00000 |
| NOME DO INTEGRANTE 2 | RM00000 |
| NOME DO INTEGRANTE 3 | RM00000 |

## Funcionalidades

- **Buscar linha** por número ou nome (`/Linha/Buscar`).
- **Detalhe da linha**: mapa com as paradas e a posição dos ônibus em tempo real, atualizada a cada 30 s (`/Parada/BuscarParadasPorLinha`, `/Posicao/Linha`).
- **Previsão de chegada** em uma parada, com minutos restantes por ônibus (`/Previsao/Parada`).
- **Favoritos** (linhas e paradas) salvos localmente com AsyncStorage.
- **Histórico de buscas** salvo com AsyncStorage, com opção de limpar; tocar em um item refaz a busca.
- Tratamento de carregamento, erro de rede/token e listas vazias.

## Tecnologias

React Native · Expo · React Navigation (tabs + stack) · AsyncStorage · react-native-maps · API Olho Vivo (SPTrans)

## Como executar

### 1. Pré-requisitos
- Node.js LTS
- App **Expo Go** no celular (ou emulador Android/iOS)
- Token da API Olho Vivo: cadastre-se no portal de desenvolvedores da SPTrans (https://www.sptrans.com.br/desenvolvedores/) e gere um token.

### 2. Instalar

```bash
git clone <URL_DO_REPOSITORIO>
cd onibus-sp
npm install
```

Se preferir montar o projeto do zero a partir destes arquivos:

```bash
npx create-expo-app@latest onibus-sp --template blank
cd onibus-sp
# copie App.js, app.json, .gitignore, .env.example e a pasta src/ para dentro do projeto
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage react-native-maps expo-build-properties expo-status-bar @expo/vector-icons
```

### 3. Configurar o token

```bash
cp .env.example .env
# edite o .env e informe seu token
EXPO_PUBLIC_SPTRANS_TOKEN=seu_token_aqui
```

O `.env` está no `.gitignore` e **não deve ser commitado**.

### 4. Rodar

```bash
npx expo start
```

Escaneie o QR Code com o Expo Go. Se mudar o `.env`, reinicie com `npx expo start -c`.

> O app usa a base URL em **HTTPS** (`src/config.js`). Se a documentação oficial da SPTrans indicar outra URL ou versão, ajuste esse arquivo. O `app.json` mantém a liberação de tráfego em texto claro como contingência.

## Estrutura

```
App.js
src/
  config.js            base URL e token
  theme.js, utils.js
  services/olhoVivo.js  login (cookie de sessão) + chamadas da API
  storage/storage.js    AsyncStorage: favoritos e histórico
  navigation/index.js   tabs (Buscar, Favoritos, Histórico) + stack (Linha, Parada)
  components/           Estado (loading/erro/vazio), LinhaItem
  screens/              Busca, Linha, Parada, Favoritos, Historico
```

## Chaves do AsyncStorage

| Chave | Conteúdo |
|---|---|
| `@onibus:favoritos` | lista de `{ id, tipo: 'linha'\|'parada', dados }` |
| `@onibus:historico` | lista de termos buscados (máx. 20, mais recente primeiro) |
