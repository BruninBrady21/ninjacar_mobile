# NinjaCar

Bem-vindo ao projeto NinjaCar (versão mobile)!

Este é um projeto feito para a entrega da Fase 4 da Pós-Tech da FIAP, para o curso de Desenvolvimento FullStack, aplicando os conhecimentos adquiridos em aula e com uma ampla pesquisa de diversas outras funcionalidades.

A aplicação tem como objetivo realizar o gerenciamento de uma coleção de carros, permitindo a listagem, inclusão, edição, remoção e visualização dos itens cadastrados.

## Quick Start

```bash
git clone https://github.com/BruninBrady21/ninjacar_mobile.git
cd NinjaCarMobile
npm install
npx expo start --lan
json-server --watch db.json --port 3000
```

## Índice

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação e Execução](#instalação-e-execução)
- [Funcionalidades](#funcionalidades)
- [Requisitos Não Funcionais](#requisitos-não-funcionais)
- [Roadmap](#roadmap)
- [Créditos](#créditos)
- [Licença](#licença)

## Tecnologias Utilizadas

-   **React Native** --- interface mobile.
-   **Expo** --- ambiente de desenvolvimento e execução.
-   **TypeScript** --- tipagem estática.
-   **React Navigation** (`native` e `native-stack`) --- navegação entre telas.
-   **Axios** --- consumo da API REST.
-   **Formik** --- gerenciamento de formulários.
-   **Yup** --- validação de campos.
-   **JSON Server** --- API simulada para desenvolvimento.
-   **Expo Status Bar** --- configuração da barra de status.

## Instalação e Execução

PRÉ-REQUISITOS:
- Node.js e npm instalados
- Git instalado para clonar o projeto
- iPhone ou celular com sistema Android com o aplicativo Expo Go instalado para testar no dispositivo
- Computador e celular conectados à mesma rede Wi-Fi para usar o modo LAN.

CLONE O PROJETO:
- git clone https://github.com/BruninBrady21/ninjacar_app.git

ACESSE A PASTA DO PROJETO:
- cd NinjaCar

INSTALE AS DEPENDÊNCIAS:
- npm install

EXECUTE A APLICAÇÃO:
- npx expo start --lan

INICIALIZE A API SIMULADA:
- npx json-server db.json --port 3000

Após iniciar o servidor, será possível ver os veículos disponíveis em:
- http://localhost:3000/vehicles

Para testar pelo iPhone, use o endereço IPv4 atual do computador no lugar de `localhost`, por exemplo:
- http://IP_DO_COMPUTADOR:3000/vehicles

Obs.: no arquivo api.ts deverá ser alterado para o IPv4 atual do computador a fim de que o projeto faça a conexão entre dispositivos. A alteração deverá ser na linha `baseURL: 'http://192.168.1.111:3000'`

Por fim, escaneie o QR Code com o dispositivo móvel para conectar e utilizar do aplicativo.

## Funcionalidades
- Listagem de carros cadastrados.
- Persistência dos dados.
- Filtragem por marca, modelo e ano.
- Edição de carros.
- Remoção de carros.
- Visualização dos itens.

## Requisitos Não Funcionais
- O sistema foi desenvolvido utilizando React Native.
- O sistema utiliza do Expo como ambiente de desenvolvimento e execução.
- O sistema é testado pelo Expo Go em um dispositivo mobile (IOS ou Android).
- O sistema realiza a comunicação com a API utilizando Axios.
- O sistema realiza a navegação entre páginas usando o React Navigation (`native` e `native-stack`) 
- O design da aplicação foi construído mantendo o padrão de cores e linguagem ubíqua definido para a aplicação web.
- O formulário para inserção de novo carro foi construído com Formik.
- O formulário possui validações para campos obrigatórios utilizando o Yup.
- O sistema persiste os dados por uma API fictícia utilizando o JSON Server.

## Roadmap
- [ ] Página de Configurações
- [ ] Sistema de carros favoritos
- [ ] Associação de imagem ao carro 
- [ ] Melhorar responsividade e aparência dos filtros
- [ ] Incluir opção de, ao clicar, abrir uma modal dialog com todos os detalhes do carro e, se possível, fotos referentes ao modelo do carro
- [ ] Incluir termos de uso & política de privacidade também no modelo de modal dialog
- [ ] Reconhecimento automático do IPv4 do dispositivo

## Créditos
- Algumas imagens e recursos visuais utilizados neste projeto pertencem aos seus respectivos autores e são empregados exclusivamente para fins educacionais, sem finalidade comercial.
- O ícone na abertura do aplicativo é derivado do seriado de televisão "LEGO Ninjago: Mestres do Spinjitzu", cujos direitos pertencem à LEGO Group e à Wil Film ApS.
- As marcas e modelos de veículos mencionados pertencem às respectivas fabricantes.

## Licença
Projeto desenvolvido exclusivamente para fins acadêmicos.
