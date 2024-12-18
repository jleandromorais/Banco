// Recupera o saldo do localStorage (se existir)
let saldo = parseFloat(localStorage.getItem('saldo')) || 2500.75; // Saldo inicial

// Função para salvar o saldo no localStorage
function salvarSaldo() {
    localStorage.setItem('saldo', saldo.toFixed(2));
}

// Função para salvar as transações no localStorage
function salvarExtrato(transacao) {
    let extrato = JSON.parse(localStorage.getItem('extrato')) || [];
    extrato.push(transacao);
    localStorage.setItem('extrato', JSON.stringify(extrato));
}

// Atualiza o saldo na interface
function atualizarSaldo() {
    document.getElementById('saldoAtual').textContent = `R$ ${saldo.toFixed(2)}`;
}

// Função de transação para PIX
document.getElementById('pixForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const valorPIX = parseFloat(document.querySelector('#pixForm input[type="number"]').value);
    
    if (valorPIX <= saldo) {
        saldo -= valorPIX; // Atualiza o saldo
        alert('PIX enviado com sucesso!');
        salvarSaldo(); // Salva o saldo atualizado
        salvarExtrato({ descricao: 'Transferência PIX', valor: -valorPIX });
        atualizarSaldo(); // Atualiza a interface
    } else {
        alert('Saldo insuficiente para realizar o PIX.');
    }
});

// Função de transação para pagamento de conta
document.getElementById('billForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const valorConta = parseFloat(document.querySelector('#billForm input[type="number"]').value);
    
    if (valorConta <= saldo) {
        saldo -= valorConta; // Atualiza o saldo
        alert('Conta paga com sucesso!');
        salvarSaldo(); // Salva o saldo atualizado
        salvarExtrato({ descricao: 'Pagamento Conta', valor: -valorConta });
        atualizarSaldo(); // Atualiza a interface
    } else {
        alert('Saldo insuficiente para pagar a conta.');
    }
});

// Função de transação para depósito
document.getElementById('depositForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const valorDeposito = parseFloat(document.querySelector('#depositForm input[type="number"]').value);
    saldo += valorDeposito; // Atualiza o saldo
    alert('Depósito realizado com sucesso!');
    salvarSaldo(); // Salva o saldo atualizado
    salvarExtrato({ descricao: 'Depósito', valor: valorDeposito });
    atualizarSaldo(); // Atualiza a interface
});

// Chama a função para mostrar o saldo atualizado na página
atualizarSaldo();

