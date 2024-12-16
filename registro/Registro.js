document.getElementById('accountForm').addEventListener('submit', function (e) {
    e.preventDefault();  // Impede o envio padrão do formulário

    // Garante que os dados sejam enviados apenas se a requisição for para a API
    if (isDirectlyCallingAPI()) {
        const formData = new FormData(this);

        const tipoCartao = [];
        if (document.getElementById('cartaoDebito').checked) tipoCartao.push('Debito');
        if (document.getElementById('cartaoCredito').checked) tipoCartao.push('Credito');

        const data = {
            nomeCompleto: formData.get('nomeCompleto'),
            dataNascimento: formData.get('dataNascimento'),
            nacionalidade: formData.get('nacionalidade'),
            naturalidade: formData.get('naturalidade'),
            estadoCivil: formData.get('estadoCivil'),
            nomePai: formData.get('nomePai'),
            nomeMae: formData.get('nomeMae'),
            email: formData.get('email'),
            cpf: formData.get('cpf'),
            tipoConta: formData.get('tipoConta'),
            agencia: formData.get('agencia'),
            tipoCartao: tipoCartao,  // Lista com os tipos de cartão selecionados
            endereco: {
                rua: formData.get('rua'),
                numero: formData.get('numero'),
                complemento: formData.get('complemento'),
                bairro: formData.get('bairro'),
                cidade: formData.get('cidade'),
                estado: formData.get('estado'),
                cep: formData.get('cep')
            },
            celular: formData.get('celular'),
            telefone: formData.get('telefone')
        };

        // Exibe uma mensagem de carregando enquanto envia os dados
        document.getElementById('feedbackMessage').innerHTML = "Enviando dados...";

        // Envia os dados via fetch para o backend
        fetch('http://localhost:8080/Registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)  // Envia os dados no formato JSON
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar os dados: ' + response.statusText);
            }
            return response.json();
        })
        .then(responseData => {
            // Exibe a mensagem de sucesso
            document.getElementById('feedbackMessage').innerHTML = `<p class="text-green-500">Dados enviados com sucesso!</p>`;
            console.log(responseData);
        })
        .catch(error => {
            // Exibe a mensagem de erro
            document.getElementById('feedbackMessage').innerHTML = `<p class="text-red-500">Houve um erro ao enviar os dados.</p>`;
            console.error(error);
        });
    } else {
        alert('A requisição não foi feita diretamente à API!');
    }
});

// Função de exemplo para determinar se a requisição é diretamente para a API
function isDirectlyCallingAPI() {
    // Aqui você pode verificar se a condição para enviar os dados é atendida
    return true; // Se sempre quiser enviar diretamente, apenas retorne 'true'
}
