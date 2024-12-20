document.addEventListener('DOMContentLoaded', () => {
    const cardForm = document.getElementById('cardForm');
    const cardsList = document.getElementById('cardsList');

    // Simula o login com um `userId` (exemplo para teste)
    const loggedUserId = JSON.parse(localStorage.getItem('loggedUserId')) || 1; // Exemplo: ID do usuário logado

    // Recupera os cartões salvos ou inicializa um objeto para cada usuário
    let allUsersCards = JSON.parse(localStorage.getItem('allUsersCards') || '{}');

    // Garante que o `loggedUserId` tenha um array vazio de cartões no início
    if (!allUsersCards[loggedUserId]) {
        allUsersCards[loggedUserId] = [];
    }

    function generateCardNumber() {
        const numbers = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10));
        return numbers.join('').match(/.{1,4}/g).join(' ');
    }

    function generateExpirationDate() {
        const today = new Date();
        const year = today.getFullYear() + 4;
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        return `${month}/${year}`;
    }

    function renderCards() {
        const userCards = allUsersCards[loggedUserId]; // Obtém os cartões do usuário logado
        cardsList.innerHTML = userCards.map((card, index) => `
            <div class="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300 relative">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-lg font-semibold">${card.type === 'credit' ? 'Crédito' : 'Débito'}</span>
                    <i class="fas fa-credit-card text-yellow-500 text-2xl"></i>
                </div>
                <div class="space-y-2">
                    <p class="font-mono text-lg">${card.number}</p>
                    <p class="text-gray-600">Validade: ${card.expiration}</p>
                </div>
                <button class="absolute top-2 right-2 text-red-500 hover:text-red-700" onclick="deleteCard(${index})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `).join('');
    }

    // Função para deletar cartão
    window.deleteCard = function (cardIndex) {
        const userCards = allUsersCards[loggedUserId]; // Obtém os cartões do usuário logado
        const cardToDelete = userCards[cardIndex]; // Encontra o cartão a ser excluído
    
        // Verifica se o cartão tem um 'id' válido
        if (!cardToDelete || !cardToDelete.id) {
            console.log("Cartão não encontrado no frontend.");
            alert('Erro: Cartão não encontrado.');
            return;
        }
    
        const cardId = cardToDelete.id; // Presume-se que cada cartão tenha um 'id' único
        console.log(`Tentando excluir o cartão com id: ${cardId}`); // Verifique o id aqui no console
    
        // Faz a requisição DELETE para o backend
        fetch(`http://localhost:8080/cards/${cardId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            console.log("Resposta do servidor:", response.status); // Verifique o status da resposta
            if (response.status === 204) {
                // Se a resposta for 204, o cartão foi deletado com sucesso
                userCards.splice(cardIndex, 1); // Remove o cartão da lista local
                allUsersCards[loggedUserId] = userCards; // Atualiza a lista de cartões
                localStorage.setItem('allUsersCards', JSON.stringify(allUsersCards)); // Salva no localStorage
                renderCards(); // Atualiza a interface com os cartões restantes
            } else {
                alert('Houve um erro ao deletar o cartão. Tente novamente mais tarde.');
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error); // Log do erro
            alert('Houve um erro ao deletar o cartão. Tente novamente mais tarde.');
        });
    };
    
    // Ao submeter o formulário, envia a requisição para criar o cartão
    cardForm.addEventListener('submit', (e) => {
        e.preventDefault();
    
        const type = document.getElementById('cardType').value;
        const newCard = {
            type: type,
            number: generateCardNumber(),
            expiration: generateExpirationDate(),
        };
    
        // Cria o payload para enviar para o backend
        const payload = {
            loggedUserId: loggedUserId,
            cards: [newCard] // Envia os cartões diretamente
        };
    
        fetch('http://localhost:8080/cards', { // URL do seu backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(`Erro no servidor: ${err.message}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Cards updated:', data);
            // Atualiza com todos os cartões do usuário retornados pelo backend
            allUsersCards[loggedUserId] = data;
            localStorage.setItem('allUsersCards', JSON.stringify(allUsersCards));
            renderCards(); // Atualiza a lista de cartões na tela
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Houve um erro ao criar o cartão. Tente novamente mais tarde.');
        });
    
        cardForm.reset(); // Limpa o formulário
    });

    // Inicializa renderizando os cartões atuais do localStorage
    renderCards();
});
