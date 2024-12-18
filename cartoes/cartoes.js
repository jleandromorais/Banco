    document.addEventListener('DOMContentLoaded', () => {
        const cardForm = document.getElementById('cardForm');
        const cardsList = document.getElementById('cardsList');
        let cards = JSON.parse(localStorage.getItem('cards') || '[]');

        function generateCardNumber() {
            const numbers = Array.from({length: 16}, () => Math.floor(Math.random() * 10));
            return numbers.join('').match(/.{1,4}/g).join(' ');
        }

        function generateExpirationDate() {
            const today = new Date();
            const year = today.getFullYear() + 4;
            const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
            return `${month}/${year}`;
        }

        function renderCards() {
            cardsList.innerHTML = cards.map((card, index) => `
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

        // Função para deletar cartão (agora acessível globalmente)
        window.deleteCard = function (index) {
            cards.splice(index, 1); // Remove o cartão pelo índice
            localStorage.setItem('cards', JSON.stringify(cards)); // Atualiza o localStorage
            renderCards(); // Re-renderiza os cartões
        };

        cardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('cardType').value;
            if (!type) return;

            const newCard = {
                type,
                number: generateCardNumber(),
                expiration: generateExpirationDate()
            };

            cards.push(newCard);
            localStorage.setItem('cards', JSON.stringify(cards));
            renderCards();
            cardForm.reset();
        });

        renderCards(); // Renderiza os cartões já salvos ao carregar a página
    });

