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
// Atualiza o saldo na interface
function atualizarSaldo() {
    fetch('http://localhost:8080/conta/saldo') // Endpoint do saldo no backend
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao recuperar o saldo.');
            }
            return response.json();
        })
        .then(data => {
            saldo = data; // Atualiza o saldo local com o valor do backend
            document.getElementById('saldoAtual').textContent = `R$ ${saldo.toFixed(2)}`;
        })
        .catch(error => {
            console.error('Erro ao atualizar o saldo:', error);
        });
}

// Função de transação para PIX
// Função de transação para PIX
document.getElementById('pixForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const valorPIX = parseFloat(document.querySelector('#pixForm input[type="number"]').value);

    fetch('http://localhost:8080/conta/pix', { // Endpoint de PIX no backend
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ valor: valorPIX }),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || 'Erro ao realizar o PIX.');
                });
            }
            return response.json();
        })
        .then(data => {
            alert(data.mensagem || 'PIX enviado com sucesso!'); // Mensagem de sucesso do backend
            atualizarSaldo(); // Atualiza o saldo após o sucesso
        })
        .catch(error => {
            console.error('Erro ao realizar o PIX:', error);
            alert(error.message || 'Houve um erro ao realizar o PIX.');
        });
});


// Função de transação para pagamento de conta
document.getElementById('billForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const valorConta = parseFloat(document.querySelector('#billForm input[type="number"]').value);

    fetch('http://localhost:8080/conta/pagar-conta', { // Endpoint de pagamento de conta
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ valor: valorConta }),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || 'Erro ao pagar a conta.');
                });
            }
            return response.json();
        })
        .then(() => {
            alert('Conta paga com sucesso!');
            atualizarSaldo(); // Atualiza o saldo após o pagamento
        })
        .catch(error => {
            console.error('Erro ao pagar a conta:', error);
            alert(error.message || 'Houve um erro ao pagar a conta.');
        });
});

// Função de transação para depósito
document.getElementById('depositForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const valorDeposito = parseFloat(document.querySelector('#depositForm input[type="number"]').value);

    fetch('http://localhost:8080/conta/depositar', { // Endpoint de depósito no backend
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ valor: valorDeposito }),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || 'Erro ao realizar o depósito.');
                });
            }
            return response.json();
        })
        .then(() => {
            alert('Depósito realizado com sucesso!');
            atualizarSaldo(); // Atualiza o saldo após o depósito
        })
        .catch(error => {
            console.error('Erro ao realizar o depósito:', error);
            alert(error.message || 'Houve um erro ao realizar o depósito.');
        });
});

// Chama a função para mostrar o saldo atualizado na página
atualizarSaldo();

