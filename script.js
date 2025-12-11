// Importa a lista de produtos do produto.js
const produtos = produtosData;

// Elementos DOM
const listaProdutos = document.getElementById('lista-produtos');
const formPesquisa = document.getElementById('form-pesquisa');
const campoPesquisa = document.getElementById('barra-pesquisa');
const sugestoesPesquisa = document.getElementById('sugestoes-pesquisa');
const mensagemStatus = document.getElementById('mensagem-status');

// Cache dos dados
const produtosNormalizados = produtos.map(produto => ({
    ...produto,
    nomeNormalizado: produto.nome.toLowerCase(),
    marcaNormalizada: produto.marca.toLowerCase(),
    categoriaNormalizada: (produto.categoria || '').toLowerCase(),
    idString: produto.id.toString()
}));

function criarElemento(tag, className, textContent = '') {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = textContent;
    return element;
}

function criarItemProduto(produto) {
    const listItem = criarElemento('li', 'produto-item');
    listItem.id = `produto-${produto.id}`;
    listItem.setAttribute('aria-label', `Detalhes do produto ${produto.nome}`);

    const link = criarElemento('a', 'produto-link');
    link.href = `detalhes.html?id=${produto.id}`;

    const imagem = document.createElement('img');
    imagem.src = (produto.imagens && produto.imagens.length) ? produto.imagens[0] : produto.imagem;
    imagem.alt = `Imagem do ${produto.nome}`;
    imagem.loading = 'lazy';
    imagem.className = 'produto-imagem';

    const nome = criarElemento('h2', 'produto-nome', produto.nome);
    const preco = criarElemento('p', 'produto-preco', produto.preco);
    const marca = criarElemento('p', 'produto-marca', `Marca: ${produto.marca}`);

    link.append(imagem, nome, preco, marca);
    listItem.appendChild(link);

    return listItem;
}

function renderizarProdutos(produtosParaRenderizar) {
    listaProdutos.innerHTML = ''; 
    if (produtosParaRenderizar.length === 0) {
        mensagemStatus.style.display = 'block';
        listaProdutos.setAttribute('aria-busy', 'false');
        return;
    }
    mensagemStatus.style.display = 'none';
    const fragmento = document.createDocumentFragment();
    produtosParaRenderizar.forEach(produto => {
        fragmento.appendChild(criarItemProduto(produto));
    });
    listaProdutos.appendChild(fragmento);
    listaProdutos.setAttribute('aria-busy', 'false');
}

function filtrarProdutos(termo) {
    const termoNormalizado = termo.toLowerCase().trim();
    if (!termoNormalizado) return produtos;
    const produtosFiltrados = produtosNormalizados.filter(produto => 
        produto.nomeNormalizado.includes(termoNormalizado) || 
        produto.marcaNormalizada.includes(termoNormalizado) || 
        produto.categoriaNormalizada.includes(termoNormalizado) ||
        produto.idString.includes(termoNormalizado)
    );
    const idsFiltrados = new Set(produtosFiltrados.map(p => p.id));
    return produtos.filter(p => idsFiltrados.has(p.id));
}

function atualizarSugestoes(termo) {
    sugestoesPesquisa.innerHTML = '';
    if (termo.length < 2) {
        sugestoesPesquisa.style.display = 'none';
        return;
    }
    const resultados = filtrarProdutos(termo).slice(0, 5);
    resultados.forEach(produto => {
        const itemSugestao = criarElemento('div', 'sugestao-item', produto.nome);
        itemSugestao.setAttribute('role', 'option');
        itemSugestao.tabIndex = -1;
        itemSugestao.addEventListener('click', () => {
            campoPesquisa.value = produto.nome;
            formPesquisa.dispatchEvent(new Event('submit'));
        });
        sugestoesPesquisa.appendChild(itemSugestao);
    });
    sugestoesPesquisa.style.display = resultados.length > 0 ? 'block' : 'none';
}

formPesquisa.addEventListener('submit', function(event) {
    event.preventDefault();
    listaProdutos.setAttribute('aria-busy', 'true');
    sugestoesPesquisa.innerHTML = '';
    sugestoesPesquisa.style.display = 'none';
    const termo = campoPesquisa.value;
    const produtosFiltrados = filtrarProdutos(termo);
    renderizarProdutos(produtosFiltrados);
});

document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos(produtos);
    // Se houver query 'q' na URL, preencha e execute a pesquisa (útil para redirecionamento de outras páginas)
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
        campoPesquisa.value = q;
        formPesquisa.dispatchEvent(new Event('submit'));
    }
});

campoPesquisa.addEventListener('input', function() {
    atualizarSugestoes(campoPesquisa.value);
});

campoPesquisa.addEventListener('blur', () => {
    setTimeout(() => {
        sugestoesPesquisa.style.display = 'none';
    }, 150); 
});

campoPesquisa.addEventListener('focus', () => {
    if (campoPesquisa.value.length >= 2) {
        atualizarSugestoes(campoPesquisa.value);
    }
});
