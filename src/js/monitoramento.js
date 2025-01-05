let intervaloMonitoramento = null;

// Função para atualizar os dados de CPU e RAM
function atualizarDesempenho() {
    // Verificar se o dashboard tem a classe 'active'
    const dashboard = document.getElementById('dashboard');
    if (!dashboard.classList.contains('active')) {
        // console.log('Monitoramento não iniciado, dashboard não está ativo.');
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

const pegarNotificacoes = () => {
    // Recupera as notificações do localStorage
    const notifications = JSON.parse(localStorage.getItem('notificacoes')) || [];
    
    // Pega as 5 últimas notificações
    const recentNotifications = notifications.slice(-5);

    // Referência ao elemento da lista onde as notificações serão exibidas
    const notificationList = document.getElementById('notification-list');
    
    // Limpa a lista de notificações
    notificationList.innerHTML = '';

    // Exibe as notificações recentes
    recentNotifications.forEach(notification => {
        const listItem = document.createElement('li');
        listItem.style.margin = '5px 0';
        listItem.style.color = notification.status === 'success' ? '#2ecc71' : '#e74c3c'; // Sucesso ou erro
        listItem.innerText = `${notification.status === 'success' ? '✅' : '❌'} ${notification.message}`;
        notificationList.appendChild(listItem);
    });
};

// Função para limpar as notificações
const limparNotificacoes = () => {
    // Limpa o conteúdo do localStorage
    localStorage.removeItem('notificacoes');

    // Limpa a lista de notificações exibidas
    document.getElementById('notification-list').innerHTML = '';
};

// Adiciona o evento de clique no botão de limpar
document.getElementById('clear-notifications').addEventListener('click', limparNotificacoes);