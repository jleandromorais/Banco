document.getElementById("simulatorForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    // Obtendo valores do formulário
    const valorInicial = parseFloat(document.getElementById("valorInicial").value);
    const prazo = parseInt(document.getElementById("prazo").value, 10);
    const tipoInvestimento = document.getElementById("tipoInvestimento").value;

    // Validação simples
    if (!valorInicial || !prazo || prazo <= 0 || valorInicial < 100) {
        alert("Por favor, preencha os campos corretamente.");
        return;
    }

    // Lógica de cálculo (exemplo simples)
    let rendimento;
    switch (tipoInvestimento) {
        case "CDB":
            rendimento = valorInicial * Math.pow(1 + 0.01, prazo);
            break;
        case "Tesouro Direto":
            rendimento = valorInicial * Math.pow(1 + 0.007, prazo);
            break;
        case "Fundos":
            rendimento = valorInicial * Math.pow(1 + 0.008, prazo);
            break;
        default:
            rendimento = valorInicial;
    }

    // Atualizando o resultado
    const resultadoTexto = document.getElementById("resultadoTexto");
    resultadoTexto.textContent = `Após ${prazo} meses, o valor estimado será de R$ ${rendimento.toFixed(2)}.`;

    // Tornando a seção visível
    document.getElementById("resultadoSimulacao").classList.remove("hidden");
});
