// script-detalhe.js

// Importa a lista de produtos do produto.js (assumindo que produto.js está carregado)
const produtos = produtosData;

/**
 * Obtém o ID do produto da URL (query parameter 'id').
 * @returns {number|null} O ID do produto como número inteiro ou null.
 */
function obterIdProdutoDaUrl() {
    // Utiliza a API URLSearchParams para ler os parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const idString = params.get('id'); // Lê o valor associado à chave 'id'

    if (!idString) {
        return null; 
    }

    const idNumero = parseInt(idString, 10);
    
    if (isNaN(idNumero) || idNumero <= 0) {
        return null;
    }
    
    return idNumero;
}

// ...

// --- Lógica Principal de Carregamento ---


// --- Implementação Completa da Renderização ---

/**
 * Renderiza os detalhes do produto na página.
 * @param {Object} produto - O objeto do produto a ser exibido.
 */
function renderizarDetalhes(produto) {
    // 1. Elementos DOM
    const nomeProdutoElement = document.getElementById('nome-produto');
    const precoProdutoElement = document.getElementById('preco-produto');
    const descricaoProdutoElement = document.getElementById('descricao-produto');
    const listaEspecificacoesElement = document.getElementById('lista-especificacoes');
    const imagemProdutoElement = document.getElementById('imagem-produto');
    const linkWhatsappElement = document.getElementById('whatsapp-link');
    const compartilharBtn = document.getElementById('compartilhar-btn');
    
    // Atualiza Título da Página
    document.title = `${produto.nome} | FB Móveis e Eletros`;

    // 2. Popula Informações
    nomeProdutoElement.textContent = produto.nome;
    precoProdutoElement.textContent = produto.preco;
    descricaoProdutoElement.textContent = produto.descricao;

    // 3. Mídia, carrossel e Acessibilidade
    // Se houver um array 'imagens' usamos até 5 imagens. Caso contrário, usamos o campo 'imagem' como fallback.
    const imagens = Array.isArray(produto.imagens) && produto.imagens.length > 0
        ? produto.imagens.slice(0, 5) // limita entre 1 e 5 imagens
        : (produto.imagem ? [produto.imagem] : []);

    let currentIndex = 0;
    const thumbnailsContainer = document.getElementById('thumbnails');
    // prevBtn/nextBtn removed - arrows have been removed from the UI; navigation is via thumbnails and keyboard.
    const carrosselEl = document.querySelector('.produto-carrossel');

    function atualizarLegendasAlt(indice) {
        imagemProdutoElement.alt = `Imagem ${indice + 1} de ${imagens.length} do produto ${produto.nome}`;
        document.getElementById('legenda-produto').textContent = `Imagem ${indice + 1} de ${imagens.length} - ${produto.marca}`;
    }

    function mostrarImagem(indice) {
        if (!imagens || imagens.length === 0) {
            imagemProdutoElement.src = produto.imagem || '';
            imagemProdutoElement.alt = `Imagem do produto: ${produto.nome}`;
            thumbnailsContainer.innerHTML = '';
            document.getElementById('legenda-produto').textContent = `Imagem ilustrativa do produto ${produto.nome}, da marca ${produto.marca}`;
            return;
        }
        currentIndex = ((indice % imagens.length) + imagens.length) % imagens.length; // wrap-around
        imagemProdutoElement.src = imagens[currentIndex];
        atualizarLegendasAlt(currentIndex);
        // Atualiza classe active nas thumbnails
        const thumbs = thumbnailsContainer.querySelectorAll('img');
        thumbs.forEach((t, i) => t.classList.toggle('active', i === currentIndex));
    }

    // Cria thumbnails
    thumbnailsContainer.innerHTML = '';
    imagens.forEach((src, i) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.alt = `Miniatura ${i + 1}`;
        thumb.loading = 'lazy';
        thumb.tabIndex = 0;
        thumb.addEventListener('click', () => mostrarImagem(i));
        thumb.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') mostrarImagem(i);
        });
        thumbnailsContainer.appendChild(thumb);
    });
    // Esconde container de miniaturas se só houver uma
    thumbnailsContainer.style.display = imagens.length <= 1 ? 'none' : 'flex';

    // Mostra a primeira imagem por padrão
    mostrarImagem(0);

    // Navigation via thumbnails click/keydown and keyboard arrow keys only (arrows removed from UI)

    // Autoplay (desativado por padrão). Colocar como `true` ativa a alternância automática.
    const AUTOPLAY = false;
    let autoplayInterval = null;
    function iniciarAutoplay() {
        if (!AUTOPLAY || autoplayInterval || imagens.length <= 1) return;
        autoplayInterval = setInterval(() => mostrarImagem(currentIndex + 1), 3000);
    }
    function pararAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    // Pausa no hover e focus para acessibilidade
    if (carrosselEl) {
        if (AUTOPLAY) {
            carrosselEl.addEventListener('mouseenter', pararAutoplay);
            carrosselEl.addEventListener('mouseleave', iniciarAutoplay);
            carrosselEl.addEventListener('focusin', pararAutoplay);
            carrosselEl.addEventListener('focusout', iniciarAutoplay);
        }
        carrosselEl.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                mostrarImagem(currentIndex - 1);
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                mostrarImagem(currentIndex + 1);
            }
        });
    }

    if (AUTOPLAY) iniciarAutoplay();

    // 4. Especificações Técnicas: mostrar Marca, Fabricante, Categoria, Cores disponíveis (lista) e Descrição
    listaEspecificacoesElement.innerHTML = '';

    // Marca
    (function() {
        const li = document.createElement('li');
        li.textContent = `Marca: ${produto.marca || '—'}`;
        listaEspecificacoesElement.appendChild(li);
    })();

    // Fabricante (opcional)
    if (produto.fabricante) {
        const li = document.createElement('li');
        li.textContent = `Fabricante: ${produto.fabricante}`;
        listaEspecificacoesElement.appendChild(li);
    }

    // Categoria (opcional)
    if (produto.categoria) {
        const li = document.createElement('li');
        li.textContent = `Categoria: ${produto.categoria}`;
        listaEspecificacoesElement.appendChild(li);
    }

    // Cores disponíveis: transformar string em lista (separador vírgula)
    (function() {
        const corStr = produto.cor || '';
        if (!corStr.trim()) {
            const li = document.createElement('li');
            li.textContent = `Cores disponíveis: Não informado`;
            listaEspecificacoesElement.appendChild(li);
            return;
        }
        const cores = corStr.split(',').map(c => c.trim()).filter(Boolean);
        if (cores.length <= 1) {
            const li = document.createElement('li');
            li.textContent = `Cores disponíveis: ${cores[0] || 'Não informado'}`;
            listaEspecificacoesElement.appendChild(li);
            return;
        }
        // Cria li pai com sublista
        const liPai = document.createElement('li');
        liPai.textContent = 'Cores disponíveis:';
        const ulCores = document.createElement('ul');
        ulCores.className = 'cores-list';
        cores.forEach(cor => {
            const li = document.createElement('li');
            li.textContent = cor;
            ulCores.appendChild(li);
        });
        liPai.appendChild(ulCores);
        listaEspecificacoesElement.appendChild(liPai);
    })();

    // Nota: descrição principal do produto não é mais adicionada à lista de especificações
    // A descrição do produto permanece em '#descricao-produto' logo abaixo do preço.

    // 5. Ações: WhatsApp
    const mensagemPadrao = encodeURIComponent(`Olá, gostaria de saber mais sobre o produto: ${produto.nome} (ID: ${produto.id}).`);
    // O link do WhatsApp usa o número de telefone (que deve ser no formato 55DDDNUMERO)
    linkWhatsappElement.href = `https://wa.me/${produto.telefone}?text=${mensagemPadrao}`;
    linkWhatsappElement.title = `Falar com vendedor sobre ${produto.nome}`;

    // 6. Ações: Compartilhamento (Web Share API)
    if (navigator.share) {
        compartilharBtn.addEventListener('click', async () => {
            try {
                await navigator.share({
                    title: `FB Móveis: ${produto.nome}`,
                    text: `Confira este produto: ${produto.nome} - ${produto.preco}!`,
                    url: window.location.href // URL da página atual
                });
            } catch (error) {
                // Erro de usuário cancelando o compartilhamento
                if (error.name !== 'AbortError') { 
                    console.error('Erro ao compartilhar:', error);
                }
            }
        });
        compartilharBtn.style.display = 'inline-block'; // Garante que o botão apareça se suportado
    } else {
        // Se a API não for suportada (ex: navegadores antigos ou desktop sem HTTPS), oculta o botão
        compartilharBtn.style.display = 'none';
    }
}


// --- Lógica Principal de Carregamento ---
document.addEventListener('DOMContentLoaded', () => {
    const produtoId = obterIdProdutoDaUrl();
    const detalhesContainer = document.getElementById('detalhes-produto-container');

    if (produtoId === null) {
        // Caso 1: ID não fornecido ou inválido na URL
        detalhesContainer.innerHTML = `
            <div class="erro-container">
                <h2 class="erro-titulo">Produto Não Encontrado</h2>
                <p class="erro-mensagem">Desculpe, não conseguimos identificar o produto. Verifique o link.</p>
            </div>
        `;
        // Oculta elementos que não devem aparecer em caso de erro
        const acoes = document.querySelector('.produto-acoes');
        if (acoes) acoes.style.display = 'none'; 
        return;
    }

    // Busca o produto na lista
    const produtoEncontrado = produtos.find(p => p.id === produtoId);

    if (!produtoEncontrado) {
        // Caso 2: ID válido, mas produto não existe nos dados
        detalhesContainer.innerHTML = `
            <div class="erro-container">
                <h2 class="erro-titulo">Produto Não Encontrado</h2>
                <p class="erro-mensagem">O produto com ID ${produtoId} não existe em nosso catálogo.</p>
            </div>
        `;
        return;
    }
    
    // Caso 3: Sucesso - Renderiza os detalhes
    renderizarDetalhes(produtoEncontrado);

    // Se houver um formulário de pesquisa nesta página (header), redireciona para a página de index com query
    const formPesquisaHeader = document.getElementById('form-pesquisa');
    if (formPesquisaHeader) {
        formPesquisaHeader.addEventListener('submit', (e) => {
            e.preventDefault();
            const valor = (document.getElementById('barra-pesquisa') || {value: ''}).value || '';
            const q = valor.trim();
            if (q.length > 0) {
                window.location.href = `index.html?q=${encodeURIComponent(q)}`;
            } else {
                window.location.href = 'index.html';
            }
        });
    }
});