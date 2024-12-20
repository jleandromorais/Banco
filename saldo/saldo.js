// Carrega o saldo atual do localStorage ou do backend
let saldo = parseFloat(localStorage.getItem('saldo')) || 2500.75; // Saldo inicial

// Função para alternar a visibilidade do saldo
function toggleSaldo() {
    const saldoElement = document.getElementById('saldoAtual');
    saldoElement.textContent = saldoElement.textContent === 'R$ ****,**' ? 
        `R$ ${saldo.toFixed(2)}` : 'R$ ****,**';
}

// Exibe o saldo atual na interface
document.getElementById('saldoAtual').textContent = `R$ ${saldo.toFixed(2)}`;

// Função para carregar o extrato de transações do backend
function carregarExtrato() {
    const extratoList = document.getElementById('extratoList');
    const carregamento = document.getElementById('carregamento');
    
    // Exibe o carregamento (se necessário)
    carregamento.style.display = 'block';
    
    // Faz a requisição para o backend para carregar as transações
    fetch('http://localhost:8080/conta/extrato') // Endpoint do backend para extrato
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o extrato.');
            }
            return response.json();
        })
        .then(transacoes => {
            extratoList.innerHTML = ''; // Limpa o conteúdo antigo
            carregamento.style.display = 'none'; // Oculta o carregamento
            
            // Exibe cada transação no extrato
            transacoes.forEach(transacao => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <div class="flex justify-between items-center">
                        <p class="font-semibold">${transacao.descricao}</p>
                        <p class="text-${transacao.valor < 0 ? 'red' : 'green'}-600">
                            ${transacao.valor < 0 ? '-' : '+'} R$ ${Math.abs(transacao.valor).toFixed(2)}
                        </p>
                    </div>
                `;
                extratoList.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar o extrato:', error);
        });
}

// Chama a função para carregar o extrato logo que a página for carregada
window.onload = carregarExtrato;

// Função para realizar o depósito
function realizarDeposito() {
    const valor = parseFloat(document.getElementById('valor').value);
    if (valor && valor > 0) {
        saldo += valor;
        // Atualiza o saldo no localStorage
        localStorage.setItem('saldo', saldo.toFixed(2));
        // Atualiza o saldo na interface
        document.getElementById('saldoAtual').textContent = `R$ ${saldo.toFixed(2)}`;
        // Recarrega o extrato
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
        // Atualiza o saldo no localStorage
        localStorage.setItem('saldo', saldo.toFixed(2));
        // Atualiza o saldo na interface
        document.getElementById('saldoAtual').textContent = `R$ ${saldo.toFixed(2)}`;
        // Recarrega o extrato
        carregarExtrato();
        document.getElementById('valor').value = ''; // Limpa o campo
    } else {
        alert('Por favor, insira um valor válido para saque.');
    }
}

// Função para atualizar o saldo
function atualizarSaldo() {
    fetch('http://localhost:8080/conta/saldo') // Endpoint do backend para saldo
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao recuperar o saldo.');
            }
            return response.json();
        })
        .then(data => {
            saldo = data.saldo; // Atualiza o saldo local com o valor do backend
            document.getElementById('saldoAtual').textContent = `R$ ${saldo.toFixed(2)}`;
        })
        .catch(error => {
            console.error('Erro ao atualizar o saldo:', error);
        });
}

// Chama a função para atualizar o saldo logo ao carregar a página (se necessário)
setTimeout(atualizarSaldo, 2000);

// Função para adicionar a transação de depósito ao backend
function depositarBackend() {
    const valor = parseFloat(document.getElementById('valor').value);
    if (valor && valor > 0) {
        // Envia a requisição para o backend para realizar o depósito
        fetch('http://localhost:8080/conta/depositar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ valor }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.mensagem);
            atualizarSaldo(); // Atualiza o saldo após o depósito
            carregarExtrato(); // Recarrega o extrato
        })
        .catch(error => {
            console.error('Erro ao realizar o depósito:', error);
            alert('Erro ao realizar o depósito.');
        });
    } else {
        alert('Por favor, insira um valor válido para depósito.');
    }
}

// Função para realizar o saque no backend
function saqueBackend() {
    const valor = parseFloat(document.getElementById('valor').value);
    if (valor && valor > 0 && valor <= saldo) {
        fetch('http://localhost:8080/conta/pagar-conta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ valor }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data);
            atualizarSaldo(); // Atualiza o saldo após o saque
            carregarExtrato(); // Recarrega o extrato
        })
        .catch(error => {
            console.error('Erro ao realizar o saque:', error);
            alert('Erro ao realizar o saque.');
        });
    } else {
        alert('Por favor, insira um valor válido para saque.');
    }
}
