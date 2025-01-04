document.getElementById('limparTemp').addEventListener('click', () => {
    window.electron.limparTemp();
    document.getElementById('status').innerText = 'Arquivos temporários sendo limpos...';
});

document.getElementById('desfragmentarDisco').addEventListener('click', () => {
    window.electron.desfragmentarDisco();
    document.getElementById('status').innerText = 'Desfragmentando disco...';
});

document.getElementById('monitorarPerformance').addEventListener('click', () => {
    document.getElementById('status').innerText = 'Obtendo dados de desempenho...';

    // Obter o uso da CPU e da RAM
    Promise.all([window.electron.obterUsoCPU(), window.electron.obterUsoRAM()])
        .then(([usoCPU, usoRAM]) => {
            const cpuStatus = `Uso de CPU: ${usoCPU.cpuUsage} | Temperatura de CPU: ${usoCPU.cpuTemp}`;
            const ramStatus = `Uso de RAM: ${usoRAM.usedRAM} de ${usoRAM.totalRAM} (Livre: ${usoRAM.freeRAM})`;
            
            document.getElementById('status').innerText = `${cpuStatus}\n${ramStatus}`;
        })
        .catch(error => {
            document.getElementById('status').innerText = 'Erro ao monitorar desempenho.';
            console.error(error);
        });
});

document.getElementById('limparCacheDNS').addEventListener('click', () => {
    window.electron.limparCacheDNS();
    document.getElementById('status').innerText = 'Cache de DNS sendo limpo...';
});

document.getElementById('verificarIntegridade').addEventListener('click', () => {
    window.electron.verificarIntegridade();
    document.getElementById('status').innerText = 'Verificando integridade do sistema...';
});

document.getElementById('desinstalarCopilot').addEventListener('click', () => {
    window.electron.desinstalarCopilot();
    document.getElementById('status').innerText = 'Desinstalando Copilot...';
});

document.getElementById('deixarModoEscuro').addEventListener('click', () => {
    window.electron.deixarModoEscuro();
    document.getElementById('status').innerText = 'Mudando para o modo escuro...';
});

document.getElementById('deixarModoClaro').addEventListener('click', () => {
    window.electron.deixarModoClaro();
    document.getElementById('status').innerText = 'Mudando para o modo claro...';
});
