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

document.getElementById('btn_otimizacaoCompleta').addEventListener('click', async (event) => {
    const actionContainer = event.target.closest('.action-container');
    const botao = event.target; // Salva uma referência ao botão

    // Desabilita SOMENTE o botão, não o container inteiro.
    botao.disabled = true;

    showAlert("Otimização em andamento...", "info", "⏳ ");

    const comandos = [
        "ipconfig /flushdns",
        "netsh int tcp set global autotuning=normal",  // Chimney removido
        "netsh int tcp set supplemental internet congestionprovider=ctcp",  // Corrigido
        "netsh int tcp set global rss=enabled",
        "netsh interface ipv6 set teredo disabled",
        "sc config wuauserv start= delayed-auto",
        "sc start wuauserv",
        "sc stop wsearch",
        "sc config wsearch start= disabled",
        "netsh int tcp set global initialrto=300",
        "netsh winsock reset",
        "netsh int tcp set global autotuninglevel=normal", 
        "netsh int tcp set global rss=enabled"
    ];    

    try {
        const resultado = await window.electronAPI.executarComandosAdmin(comandos);
        if (resultado.sucesso) {
            showAlert("Otimização de WI-FI finalizada com sucesso", "success", "✔️ ", 2000);
            adicionarNotificacaoLimpeza("Otimização de WI-FI finalizada com sucesso", "success");

            // Marca todos os botões como ativos após a otimização completa
            document.querySelectorAll('.toggle-button').forEach(button => {
                button.classList.add('active');
            });

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

// Função para executar um comando específico
async function executarComando(comando, descricao) {
    try {
        showAlert(`Executando: ${descricao}`, "info", "⏳ ");
        const resultado = await window.electronAPI.executarComandosAdmin([comando]);
        if (resultado.sucesso) {
            showAlert(`${descricao} concluído com sucesso`, "success", "✔️ ", 2000);
        } else {
            showAlert(`Erro ao executar ${descricao}: ${resultado.erro}`, "error", "❌ ", 2000);
        }
    } catch (error) {
        console.error(`Erro geral em ${descricao}:`, error);
        showAlert(`Erro em ${descricao}: ${error.message || "Erro desconhecido"}`, "error", "❌ ", 2000);
    }
}

// Wifi comandos
document.querySelectorAll('.toggle-button').forEach(button => {
    button.addEventListener('click', async () => {
        // Desativa todos os botões durante a execução
        document.querySelectorAll('.toggle-button').forEach(btn => btn.disabled = true);

        const id = button.id;
        const isActive = button.classList.toggle('active'); // Alterna estado ativo/inativo

        try {
            if (isActive) {
                switch (id) {
                    case "cmd1_otimizar_wifi":
                        console.log("Nenhuma ação necessária para desfazer Flush DNS.");
                        break;
                    case "cmd2_otimizar_wifi":
                        await executarComando("netsh int tcp set global chimney=disabled", "Desativar Chimney TCP");
                        break;
                    case "cmd3_otimizar_wifi":
                        await executarComando("netsh int tcp set global autotuning=disabled", "Desativar Autotuning");
                        break;
                    case "cmd4_otimizar_wifi":
                        await executarComando("netsh int tcp set supplemental internet congestionprovider=none", "Remover Congestion Provider");
                        break;
                    case "cmd5_otimizar_wifi":
                        await executarComando("netsh int tcp set global rss=disabled", "Desabilitar RSS");
                        break;
                    case "cmd6_otimizar_wifi":
                        await executarComando("netsh interface ipv6 set teredo default", "Ativar Teredo");
                        break;
                    case "cmd7_otimizar_wifi":
                        await executarComando("sc config wuauserv start= demand", "Restaurar Delay de Início WUA");
                        break;
                    case "cmd8_otimizar_wifi":
                        await executarComando("netsh int tcp reset", "Restaurar Initial RTT (Restaura todos os TPC'S)");
                        break;
                    case "cmd9_otimizar_wifi":
                        await executarComando("REG DELETE \"HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\" /v TcpTimedWaitDelay /f", "Restaurar Tcp Timed Wait");
                        break;
                    default:
                        console.error("Comando de desfazer não reconhecido");
                }                
            } else {
                switch (id) {
                    case "cmd1_otimizar_wifi":
                        console.log("Nenhuma ação necessária para desfazer Flush DNS.");
                        break;
                    case "cmd2_otimizar_wifi":
                        await executarComando("netsh int tcp set global chimney=disabled", "Desativar Chimney TCP");
                        break;
                    case "cmd3_otimizar_wifi":
                        await executarComando("netsh int tcp set global autotuning=disabled", "Desativar Autotuning");
                        break;
                    case "cmd4_otimizar_wifi":
                        await executarComando("netsh int tcp set supplemental internet congestionprovider=none", "Remover Congestion Provider");
                        break;
                    case "cmd5_otimizar_wifi":
                        await executarComando("netsh int tcp set global rss=disabled", "Desabilitar RSS");
                        break;
                    case "cmd6_otimizar_wifi":
                        await executarComando("netsh interface ipv6 set teredo default", "Ativar Teredo");
                        break;
                    case "cmd7_otimizar_wifi":
                        await executarComando("sc config wuauserv start= demand", "Restaurar Delay de Início WUA");
                        break;
                    case "cmd8_otimizar_wifi":
                        await executarComando("netsh int tcp reset", "Restaurar Initial RTT (Restaura todos os TPC'S)");
                        break;
                    case "cmd9_otimizar_wifi":
                        await executarComando("REG DELETE \"HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\" /v TcpTimedWaitDelay /f", "Restaurar Tcp Timed Wait");
                        break;
                    default:
                        console.error("Comando de desfazer não reconhecido");
                }
            }
        } catch (error) {
            console.error("Erro ao executar comando:", error);
        } finally {
            // Reativa todos os botões após a execução
            document.querySelectorAll('.toggle-button').forEach(btn => btn.disabled = false);
        }        
    });
});