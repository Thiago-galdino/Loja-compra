let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let usuarioAtual = localStorage.getItem('usuarioAtual');

// Exibir nome do usuário logado e atualizar estado dos botões
function atualizarUsuarioLogado() {
    const usuarioLogado = document.getElementById('usuarioLogado');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');

    if (usuarioAtual) {
        usuarioLogado.textContent = `Bem-vindo, ${usuarioAtual}!`;
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
    } else {
        usuarioLogado.textContent = '';
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
    }
}

// Exibir produtos do catálogo
async function carregarCatalogo() {
    const catalogo = document.getElementById('catalogo');
    const response = await fetch('https://fakestoreapi.com/products');
    const produtos = await response.json();

    produtos.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.className = 'produto';
        produtoDiv.innerHTML = `
            <img src="${produto.image}" alt="${produto.title}" class="produto-img">
            <h3>${produto.title}</h3>
            <p>Preço: R$${produto.price.toFixed(2)}</p>
            <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
        `;
        catalogo.appendChild(produtoDiv);
    });
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(id) {
    const produto = carrinho.find(item => item.id === id);
    if (produto) {
        produto.quantidade++;
    } else {
        carrinho.push({ id, quantidade: 1 });
    }
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinho();
}

// Atualizar exibição do carrinho
function atualizarCarrinho() {
    const carrinhoItens = document.getElementById('carrinhoItens');
    const totalCarrinho = document.getElementById('totalCarrinho');
    carrinhoItens.innerHTML = '';

    let total = 0;

    carrinho.forEach(item => {
        const produto = fetch(`https://fakestoreapi.com/products/${item.id}`).then(res => res.json());
        total += produto.price * item.quantidade;
        carrinhoItens.innerHTML += `
            <p>${produto.title} - R$${produto.price.toFixed(2)} x ${item.quantidade}
                <button onclick="removerDoCarrinho(${item.id})">Remover</button>
            </p>
        `;
    });

    totalCarrinho.innerHTML = `Total: R$${total.toFixed(2)}`;
}

// Remover produto do carrinho
function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinho();
}

// Finalizar compra
function finalizarCompra() {
    if (usuarioAtual) {
        alert('Compra finalizada com sucesso!');
        carrinho = [];
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinho();
    } else {
        alert('Você precisa estar logado para finalizar a compra.');
    }
}

// Login de usuário
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (localStorage.getItem(username)) {
        const usuario = JSON.parse(localStorage.getItem(username));
        if (usuario.senha === password) {
            usuarioAtual = username;
            localStorage.setItem('usuarioAtual', usuarioAtual);
            alert('Login realizado com sucesso!');
            toggleLoginModal();
            atualizarUsuarioLogado();
            atualizarCarrinho();
        } else {
            alert('Senha incorreta!');
        }
    } else {
        alert('Usuário não encontrado!');
    }
}

// Cadastro de usuário
function signup() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        if (localStorage.getItem(username)) {
            alert('Usuário já cadastrado!');
        } else {
            const usuario = { senha: password };
            localStorage.setItem(username, JSON.stringify(usuario));
            alert('Usuário cadastrado com sucesso!');
            toggleLoginModal();
            atualizarUsuarioLogado();
        }
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Logout do usuário
function logout() {
    usuarioAtual = null;
    localStorage.removeItem('usuarioAtual');
    atualizarUsuarioLogado();
    atualizarCarrinho();
}

// Alternar visibilidade do modal de login
function toggleLoginModal() {
    const loginModal = document.getElementById('loginModal');
    loginModal.style.display = loginModal.style.display === 'block' ? 'none' : 'block';
}

// Carregar informações iniciais
document.addEventListener('DOMContentLoaded', () => {
    carregarCatalogo();
    atualizarCarrinho();
    atualizarUsuarioLogado();
});
