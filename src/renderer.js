document.getElementById('limparTemp').addEventListener('click', async (event) => {
    const actionContainer = event.target.closest('.action-container'); // Referência à div com a classe 'action-container'
    actionContainer.style.pointerEvents = 'none'; // Desabilita a interação com a div

    try {
        // Envia a solicitação para o main process
        const response = await window.electron.limparTemp(); // Certifique-se de que a resposta é recebida aqui

        // Mesmo que erros não críticos ocorram, mostramos a mensagem de sucesso
        showAlert("Arquivos temporários limpos com sucesso", "success", "✔️ ", 2000); // Alerta de sucesso

        // Adiciona a notificação no localStorage
        const notifications = JSON.parse(localStorage.getItem('notificacoes')) || [];
        notifications.push({
            message: 'Arquivos temporários limpos com sucesso',
            status: "success",
            date: new Date().toISOString() // Adiciona a data da notificação
        });
        localStorage.setItem('notificacoes', JSON.stringify(notifications));
    } catch (error) {
        // Ignora erros não críticos e ainda exibe o sucesso
        console.warn('Erro ao limpar os arquivos temporários (não crítico):', error);
        
        // Notifica sucesso mesmo que haja erros não críticos
        showAlert("Arquivos temporários limpos com sucesso (alguns arquivos não encontrados)", "success", "✔️ ", 2000);
    } finally {
        actionContainer.style.pointerEvents = 'auto'; // Reabilita a interação com a div
    }
});

// No seu código de otimização, a notificação de "Em andamento" será interrompida antes da conclusão do processo
document.getElementById('configurarWifi').addEventListener('click', async (event) => {
    const actionContainer = event.target.closest('.action-container');
    actionContainer.style.pointerEvents = 'none'; // Desabilita a interação com a div

    // Exibe uma notificação de "Processando..." antes de iniciar o processo
    const alertId = showAlert("Otimização em andamento...", "info", "⏳ ");

    try {
        // Envia a solicitação para o main process e aguarda o resultado
        const result = await window.electron.otimizarInternetCompleto();

        if (result.situacao === 'success') {
            showAlert(result.mensagem, "success", "✔️ ", 2000);
            // removeAlert(alertId);
            actionContainer.style.pointerEvents = 'auto';
        } else {
            showAlert(`${result.mensagem} (Código: ${result.codigo})`, "error", "❌ ", 2000);
            actionContainer.style.pointerEvents = 'auto';
        }

        // Adiciona a notificação no localStorage com a data
        const notifications = JSON.parse(localStorage.getItem('notificacoes')) || [];
        notifications.push({
            message: result.situacao === 'success' ? result.mensagem : `${result.mensagem} (Código: ${result.codigo})`,
            status: result.situacao,
            date: new Date().toISOString() // Adiciona a data da notificação
        });
        localStorage.setItem('notificacoes', JSON.stringify(notifications));

    } catch (error) {
        // Caso ocorra algum erro no processo
        removeAlert(alertId);
        showAlert("Erro ao otimizar a internet. Tente novamente.", "error", "❌ ", 2000);
        console.error(error);

        // Reabilita a interação com a div, mesmo em caso de erro
        actionContainer.style.pointerEvents = 'auto';
    }
});
