let intervaloMonitoramento = null;

// Função para atualizar os dados de CPU e RAM
function atualizarDesempenho() {
    // Verificar se o dashboard tem a classe 'active'
    const dashboard = document.getElementById('dashboard');
    if (!dashboard.classList.contains('active')) {
        console.log('Monitoramento não iniciado, dashboard não está ativo.');
        return; // Não executa a atualização se o dashboard não tiver a classe 'active'
    }

    // Obter o uso da CPU e da RAM
    Promise.all([window.electron.obterUsoCPU(), window.electron.obterUsoRAM()])
    .then(([usoCPU, usoRAM]) => {
        // Construir textos para CPU e RAM
        const cpuStatus = `Uso de CPU: ${usoCPU.cpuUsage}% | Temperatura: ${usoCPU.cpuTemp}°C`;
        const ramStatus = `Uso de RAM: ${usoRAM.usedRAM} / ${usoRAM.totalRAM} (Livre: ${usoRAM.freeRAM})`;
        
        // Atualizar textos nos parágrafos
        document.getElementById('cpuTexto').innerText = cpuStatus;
        document.getElementById('ramTexto').innerText = ramStatus;

        // Extrair números dos valores de RAM (remover 'GB' ou outros textos)
        const usedRAM = parseFloat(usoRAM.usedRAM.replace(/[^\d.]/g, ''));
        const totalRAM = parseFloat(usoRAM.totalRAM.replace(/[^\d.]/g, ''));
        
        // Calcular porcentagem de uso de RAM
        const ramPercent = (usedRAM / totalRAM) * 100;

        // Atualizar barras de progresso
        document.getElementById('cpuBarra').style.width = usoCPU.cpuUsage;
        document.getElementById('ramBarra').style.width = ramPercent + '%';
    })
    .catch(error => {
        console.error('Erro ao obter desempenho:', error);
    });
}

// Inicia o monitoramento ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    atualizarDesempenho(); // Atualiza imediatamente
    if (!intervaloMonitoramento) {
        intervaloMonitoramento = setInterval(atualizarDesempenho, 5000); // Atualiza a cada 5 segundos
        console.log('Monitoramento iniciado.');
    }
});
