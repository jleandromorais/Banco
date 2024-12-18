
// Carrega o saldo atual do localStorage
let saldo = parseFloat(localStorage.getItem('saldo')) || 2500.75; // Saldo inicial

function toggleSaldo() {
    const saldoElement = document.getElementById('saldoAtual');
    saldoElement.textContent = saldoElement.textContent === 'R$ ****,**' ? 
        `R$ ${saldo.toFixed(2)}` : 'R$ ****,**';
}

// Exibe o saldo atual
document.getElementById('saldoAtual').textContent = `R$ ${saldo.toFixed(2)}`;

// Função de simulação de extrato
const transacoes = [
    { descricao: 'Transferência PIX', valor: -150.00 },
    { descricao: 'Depósito', valor: 1000.00 },
    { descricao: 'Pagamento Conta', valor: -89.90 },
    { descricao: 'Recebimento Salário', valor: 3500.00 }
];

// Função para carregar o extrato
// Atualiza o extrato automaticamente ao carregar a página
function carregarExtrato() {
const extratoList = document.getElementById('extratoList');
const carregamento = document.getElementById('carregamento');

// Remover o carregamento animado
carregamento.style.display = 'none';

// Exibe as transações no extrato
extratoList.innerHTML = ''; // Limpa o conteúdo antigo

const transacoes = JSON.parse(localStorage.getItem('extrato')) || [];

transacoes.forEach(transacao => {
const div = document.createElement('div');
div.innerHTML = `
    <div class="flex justify-between items-center">
        <p class="font-semibold">${transacao.descricao}</p>
        <p class="text-${transacao.valor < 0 ? 'red' : 'green'}-600">${transacao.valor < 0 ? '-' : '+'} R$ ${Math.abs(transacao.valor).toFixed(2)}</p>
    </div>
`;
extratoList.appendChild(div);
});
}

// Chama a função para carregar o extrato logo que a página for carregada
window.onload = carregarExtrato;


// Função para realizar o depósito
function realizarDeposito() {
    const valor = parseFloat(document.getElementById('valor').value);
    if (valor && valor > 0) {
        saldo += valor;
        transacoes.push({ descricao: 'Depósito', valor });
        localStorage.setItem('saldo', saldo.toFixed(2));
        document.getElementById('saldoAtual').textContent = `R$ ${saldo.toFixed(2)}`;
        carregarExtrato();
        document.getElementById('valor').value = ''; // Limpa o campo
    } else {
        alert('Por favor, insira um valor válido para depósito.');
    }
}

// Função para realizar o saque
function realizarSaque() {
    const valor = parseFloat(document.getElementById('valor').value);
    if (valor && valor > 0 && valor <= saldo) {
        saldo -= valor;
        transacoes.push({ descricao: 'Saque', valor: -valor });
        localStorage.setItem('saldo', saldo.toFixed(2));
        document.getElementById('saldoAtual').textContent = `R$ ${saldo.toFixed(2)}`;
        carregarExtrato();
        document.getElementById('valor').value = ''; // Limpa o campo
    } else {
        alert('Por favor, insira um valor válido para saque.');
    }
}

// Chama a função para carregar o extrato após 2 segundos (simulando carregamento)
setTimeout(carregarExtrato, 2000);
