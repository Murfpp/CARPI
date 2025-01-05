function optimize(action) {
    switch (action) {
        case 'system':
            alert('Otimização do sistema iniciada.');
            break;
        case 'internet':
            alert('Otimização da internet iniciada.');
            break;
        case 'clean':
            alert('Limpeza do sistema iniciada.');
            break;
        case 'disk':
            alert('Desfragmentação do disco iniciada.');
            break;
        case 'startup':
            alert('Gerenciamento de inicialização iniciado.');
            break;
        case 'backup':
            alert('Backup em andamento.');
            break;
        case 'update':
            alert('Atualização do sistema iniciada.');
            break;
        case 'antivirus':
            alert('Verificação de vírus em andamento.');
            break;
        default:
            alert('Ação desconhecida.');
    }
}

// Função para navegação entre os painéis
function navigateTo(panelId) {
    // Esconde todos os painéis
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
        panel.classList.remove('active');
        // Reinicia a opacidade para permitir o efeito de transição novamente
        panel.style.display = 'none';
    });

    // Exibe o painel selecionado com transição suave
    const selectedPanel = document.getElementById(panelId);
    selectedPanel.classList.add('active');
    selectedPanel.style.display = 'block'; // Garantir que o painel apareça

    // Atualiza a barra lateral (ativando a seção correta)
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => item.classList.remove('active'));
    const activeSidebarItem = Array.from(sidebarItems).find(item => item.textContent.trim().toLowerCase() === panelId);
    if (activeSidebarItem) {
        activeSidebarItem.classList.add('active');
    }
}

// Função de ação (ao clicar nas opções dentro dos painéis)
function action(actionType) {
    alert(`Ação: ${actionType}`);
}
