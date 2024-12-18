const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const cancelLogin = document.getElementById('cancelLogin');
const errorMessage = document.getElementById('errorMessage'); // Elemento de erro

// Quando o botão de login for clicado, abrir o modal
loginBtn.addEventListener('click', () => {
    loginModal.classList.remove('hidden');
    errorMessage.classList.add('hidden'); // Esconde a mensagem de erro ao abrir o modal
});

// Quando o botão de cancelar for clicado, fechar o modal
cancelLogin.addEventListener('click', () => {
    loginModal.classList.add('hidden');
    errorMessage.classList.add('hidden'); // Esconde a mensagem de erro ao cancelar
});

// Quando o formulário for submetido
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const agency = document.getElementById('agency').value;
    const account = document.getElementById('cpf').value;

    try {
        const response = await fetch('http://localhost:8080/validar-conta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cpf: account,
                agencia: agency,
                nomeCompleto: fullName,
            }),
        });

        if (!response.ok) {
            throw new Error('Falha na conexão com o servidor. Tente novamente mais tarde.');
        }

        const result = await response.json();

        if (result.success) {
            // Salvar o primeiro nome no sessionStorage
            const firstName = fullName.split(' ')[0];
            sessionStorage.setItem('userName', firstName);

            loginBtn.textContent = `Bem-vindo, ${firstName}`;
            loginBtn.disabled = true;
            loginBtn.classList.add('cursor-default');
            loginModal.classList.add('hidden');
        } else {
            errorMessage.textContent = result.message || 'Erro na validação da conta. Tente novamente.';
            errorMessage.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Erro na validação:", error);
        errorMessage.textContent = error.message || 'Erro ao validar conta. Tente novamente.';
        errorMessage.classList.remove('hidden');
    }
});

// Verificar o estado do login ao carregar qualquer página
window.addEventListener('DOMContentLoaded', () => {
    const userName = sessionStorage.getItem('userName');

    if (userName) {
        // Se o nome do usuário estiver no sessionStorage, mostra "Bem-vindo"
        loginBtn.textContent = `Bem-vindo, ${userName}`;
        loginBtn.disabled = true;
        loginBtn.classList.add('cursor-default');
    } else {
        // Caso contrário, exibe "Acessar Conta"
        loginBtn.textContent = 'Acessar Conta';
        loginBtn.disabled = false;
        loginBtn.classList.remove('cursor-default');
    }
});

// Função para fazer logout
function logout() {
    // Remover o nome do usuário do sessionStorage
    sessionStorage.removeItem('userName');

    // Atualizar o botão de login para "Acessar Conta"
    loginBtn.textContent = 'Acessar Conta';
    loginBtn.disabled = false;
    loginBtn.classList.remove('cursor-default');

    // Opcionalmente, redireciona para a página inicial
    window.location.href = 'index.html'; // Altere conforme necessário
}

// Se houver um botão de logout na página, adicione um evento para chamar a função logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}
function redirectIfLogged(targetUrl) {
    const userName = sessionStorage.getItem('userName');

    if (userName) {
        // Redireciona se o usuário estiver logado
        window.location.href = targetUrl;
    } else {
        // Mostra uma mensagem ou exibe o modal de login
        alert('Você precisa estar logado para acessar esta funcionalidade.');
    }
}
