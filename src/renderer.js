document.getElementById('limparTemp').addEventListener('click', async (event) => {
    const actionContainer = event.target.closest('.action-container'); // Referência à div com a classe 'action-container'
    actionContainer.style.pointerEvents = 'none'; // Desabilita a interação com a div

    try {
        // Envia a solicitação para o main process
        const response = await window.electron.limparTemp(); // Certifique-se de que a resposta é recebida aqui
        showAlert("Arquivos temporários limpos com sucesso", "success", "✔️ ", 2000); // Alerta de sucesso

        // Adiciona a notificação no localStorage
        const notifications = JSON.parse(localStorage.getItem('notificacoes')) || [];
        notifications.push({
            message: response.message,
            status: "success"
        });
        localStorage.setItem('notificacoes', JSON.stringify(notifications));
    } catch (error) {
        console.error('Erro ao limpar os arquivos temporários:', error);
    } finally {
        actionContainer.style.pointerEvents = 'auto'; // Reabilita a interação com a div
    }
});


// document.getElementById('desfragmentarDisco').addEventListener('click', () => {
//     window.electron.desfragmentarDisco();
//     document.getElementById('status').innerText = 'Desfragmentando disco...';
// });

// document.getElementById('limparCacheDNS').addEventListener('click', () => {
//     window.electron.limparCacheDNS();
//     document.getElementById('status').innerText = 'Cache de DNS sendo limpo...';
// });

// document.getElementById('verificarIntegridade').addEventListener('click', () => {
//     window.electron.verificarIntegridade();
//     document.getElementById('status').innerText = 'Verificando integridade do sistema...';
// });

// document.getElementById('desinstalarCopilot').addEventListener('click', () => {
//     window.electron.desinstalarCopilot();
//     document.getElementById('status').innerText = 'Desinstalando Copilot...';
// });

// document.getElementById('deixarModoEscuro').addEventListener('click', () => {
//     window.electron.deixarModoEscuro();
//     document.getElementById('status').innerText = 'Mudando para o modo escuro...';
// });

// document.getElementById('deixarModoClaro').addEventListener('click', () => {
//     window.electron.deixarModoClaro();
//     document.getElementById('status').innerText = 'Mudando para o modo claro...';
// });
