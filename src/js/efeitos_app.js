function navigateTo(panelId) {
    // Esconde todos os painéis
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
        panel.classList.remove('active');
        // panel.style.display = 'none';
    });

    // Exibe o painel selecionado
    const selectedPanel = document.getElementById(panelId);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
        // selectedPanel.style.display = 'block';
    }

    // Atualiza a barra lateral
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => item.classList.remove('active'));

    const activeSidebarItem = Array.from(sidebarItems).find(item => item.dataset.panel === panelId);
    if (activeSidebarItem) {
        activeSidebarItem.classList.add('active');
    }
}

// Adiciona os eventos de clique dinamicamente para cada item da barra lateral
document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
        const panelId = item.dataset.panel; // Obtém o valor de 'data-panel'
        navigateTo(panelId);
    });
});
// Função de ação (ao clicar nas opções dentro dos painéis)
function action(actionType) {
    alert(`Ação: ${actionType}`);
}


document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear('contaValida');
    window.location.href = '../index.html';
});