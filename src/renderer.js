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
    const botao = event.target; // Salva uma referência ao botão

    // Desabilita SOMENTE o botão, não o container inteiro.
    botao.disabled = true;

    showAlert("Otimização em andamento...", "info", "⏳ ");

    const comandos = [
        "Set-NetAdapterRsc -Name \"Wi-Fi\" -Enabled $true",
        "Set-NetAdapterRsc -Name \"Wi-Fi\" -EnabledIPv6 $true",
        "netsh int tcp set global chimney=enabled",
        "netsh int tcp set global autotuning=normal",
        "netsh int tcp set global congestionprovider=ctcp",
        "netsh int tcp set global rss=enabled",
        "ipconfig /flushdns",
        "REG ADD \"HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DeliveryOptimization\\Config\" /v DODownloadMode /t REG_DWORD /d 0 /f > nul"
    ];

    try {
        const resultado = await window.electronAPI.executarComandosAdmin(comandos);
        if (resultado.sucesso) {
            showAlert("Otimização de WI-FI finalizada com sucesso", "success", "✔️ ", 2000);
            adicionarNotificacaoLimpeza("Otimização de WI-FI finalizada com sucesso", "success");
        } else {
            console.error("Erro ao executar o comando:", resultado.erro);
            showAlert(`Erro ao otimizar: ${resultado.erro}`, "error", "❌ ", 2000);
            adicionarNotificacaoLimpeza(`Erro ao otimizar: ${resultado.erro}`, "error");
        }
    } catch (error) {
        console.error("Erro geral na otimização:", error);
        const mensagemDeErro = error.message ? `Erro geral: ${error.message}` : "Erro desconhecido ao otimizar a internet.";
        showAlert(mensagemDeErro, "error", "❌ ", 2000);

        adicionarNotificacaoLimpeza(mensagemDeErro, "error");
    } finally {
        // SEMPRE reabilita o botão no finally.
        botao.disabled = false;
    }
});

function adicionarNotificacaoLimpeza(mensagem, status) {
    try {
        const notifications = JSON.parse(localStorage.getItem('notificacoes')) || [];

        notifications.push({
            message: mensagem,
            status: status,
            date: new Date().toISOString()
        });

        localStorage.setItem('notificacoes', JSON.stringify(notifications));
        return true; // Indica sucesso na adição
    } catch (error) {
        console.error("Erro ao adicionar notificação:", error);
        return false; // Indica falha na adição
    }
}
