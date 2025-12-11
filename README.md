# Catálogo de Produtos

Este projeto é um catálogo de produtos que permite aos usuários visualizar uma lista de produtos e acessar detalhes sobre cada um deles.

## Estrutura do Projeto

O projeto possui a seguinte estrutura de diretórios:

```
catalogo-produtos
├── src
│   ├── produto.js          # Contém os dados dos produtos disponíveis.
│   ├── index.html          # Página inicial que exibe a lista de produtos.
│   ├── detalhes.html       # Página que exibe os detalhes de um produto específico.
│   └── js
│       └── script-detalhe.js # Script que manipula a exibição dos detalhes do produto.
├── README.md               # Documentação do projeto.
```

## Arquivos Principais

### `src/produto.js`
Este arquivo contém um array de objetos que representam os produtos disponíveis. Cada objeto possui as seguintes propriedades:
- `id`: Identificador único do produto.
- `nome`: Nome do produto.
- `preco`: Preço do produto.
- `descricao`: Descrição do produto.
- `imagem`: Caminho da imagem do produto.
- `especificacoes`: Lista de especificações do produto.

### `src/index.html`
A página inicial do catálogo de produtos. Ela exibe uma lista de produtos, permitindo que os usuários cliquem em um produto para ver mais detalhes. O arquivo inclui referências ao `produto.js` para carregar os dados dos produtos.

### `src/detalhes.html`
Responsável por renderizar os detalhes de um produto específico. Utiliza o `script-detalhe.js` para buscar o ID do produto na URL, carregar os dados do produto a partir do `produto.js` e exibir as informações na página.

### `src/js/script-detalhe.js`
Contém o código JavaScript que manipula a exibição dos detalhes do produto. Ele busca o ID do produto na URL, encontra o produto correspondente no array de produtos e atualiza o conteúdo da página com as informações do produto.

## Como Executar o Projeto

1. Clone o repositório ou baixe os arquivos do projeto.
2. Abra o arquivo `index.html` em um navegador web.
3. Navegue pela lista de produtos e clique em um produto para ver seus detalhes.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.