const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const si = require('systeminformation');
const path = require('path');
const os = require('os');

// Caminho absoluto para o PowerShell (com base no sistema operacional)
const powerShellPath = "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";

// Criação da janela principal do Electron
function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 600,
        resizable: false, // Impede o redimensionamento da janela
        fullscreenable: false, // Impede a tela cheia
        maximizable: false, // Impede maximização
        frame: true, // Remove a barra de título padrão mexer depois
        webPreferences: {
            nodeIntegration: false, // Melhor prática
            contextIsolation: true,
            devTools: false, // Permitir DevTools
            preload: path.join(__dirname, 'preload.js') // Definir o script de preload
        }
    });

    win.loadFile('src/index.html');
    // win.webContents.openDevTools();

    // Bloquear Ctrl+Shift+I
    win.webContents.on('before-input-event', (event, input) => {
        if (input.control && input.shift && input.key === 'I') {
            event.preventDefault();
        }
    });
}

// Obter dados de CPU (uso e temperatura)
async function obterUsoCPU() {
    try {
        const cpuInfo = await si.currentLoad();
        const cpuTemp = await si.cpuTemperature();
        return {
            cpuUsage: cpuInfo.currentLoad.toFixed(2) + '%', // Porcentagem de uso da CPU
            cpuTemp: cpuTemp.main ? cpuTemp.main.toFixed(2) + '°C' : 'N/A' // Temperatura da CPU
        };
    } catch (error) {
        console.error(`Erro ao obter dados da CPU: ${error}`);
        return { cpuUsage: 'N/A', cpuTemp: 'N/A' };
    }
}

// Obter dados de memória RAM
async function obterUsoRAM() {
    try {
        const memory = await si.mem();
        const totalRAM = (memory.total / (1024 ** 3)).toFixed(2); // Total de RAM em GB
        const freeRAM = (memory.free / (1024 ** 3)).toFixed(2); // RAM livre em GB
        const usedRAM = (memory.used / (1024 ** 3)).toFixed(2); // RAM usada em GB
        return {
            totalRAM: totalRAM + ' GB',
            freeRAM: freeRAM + ' GB',
            usedRAM: usedRAM + ' GB'
        };
    } catch (error) {
        console.error(`Erro ao obter dados de memória: ${error}`);
        return { totalRAM: 'N/A', freeRAM: 'N/A', usedRAM: 'N/A' };
    }
}

// Inicializando a janela principal
app.whenReady().then(() => {
    Menu.setApplicationMenu(null);
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});


// Fechar a janela quando o app for fechado
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Funções de otimização

// Limpeza de arquivos temporários
async function limparTemp() {
    return new Promise((resolve, reject) => {
        const command = `${powerShellPath} -WindowStyle Hidden -Command "Remove-Item -Path $env:TEMP\\* -Recurse -Force; Remove-Item -Path C:\\Windows\\Temp\\* -Recurse -Force"`;

        exec(command, (err, stdout, stderr) => {
            if (err) {
                // Verifica se o erro é relacionado a um arquivo ou diretório não encontrado, por exemplo
                if (stderr.includes("Cannot find path")) {
                    console.log("Alguns arquivos não foram encontrados, mas isso não é um erro crítico.");
                    resolve({ situacao: 'warning', mensagem: 'Alguns arquivos temporários não foram encontrados, mas a limpeza foi concluída.' });
                } else {
                    console.error(`Erro ao limpar arquivos temporários: ${stderr}`);
                    reject({ situacao: 'error', mensagem: `Erro ao limpar arquivos temporários: ${stderr}` });
                }
            } else {
                console.log('Arquivos temporários limpos com sucesso!');
                resolve({ situacao: 'success', mensagem: 'Arquivos temporários limpos com sucesso!' });
            }
        });
    });
}

// Registro de handler com ipcMain.handle para limpar arquivos temporários
ipcMain.handle('limparTemp', async () => {
    try {
        const resultado = await limparTemp();
        return resultado; // Retorna o resultado para o renderer
    } catch (error) {
        return error; // Retorna o erro caso ocorra
    }
});

async function desfragmentarOtimizarDisco() {
}

// Verificar e corrigir arquivos corrompidos do sistema
async function verificarIntegridade() {
}

// Limpar cache de DNS
async function limparCacheDNS() {
}

// Função para desinstalar o Copilot do Windows
async function desinstalarCopilot() {

}


// Função otimizarInternetCompleto
async function otimizarInternetCompleto(event) {
    return new Promise((resolve, reject) => {
        // Seu código para executar a otimização
        const batScript = `
        echo | set /p=Verificando cache DNS antes da limpeza...
        ipconfig /displaydns
        echo -------------------------------------
        echo | set /p=Desativar otimização de entrega (download de atualizações para outras máquinas usando a sua banda)
        REG ADD "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DeliveryOptimization\\Config" /v DODownloadMode /t REG_DWORD /d 0 /f > nul
        echo OK

        echo | set /p=Limpar cache DNS
        ipconfig /flushdns
        echo Cache DNS limpo com sucesso.

        echo | set /p=Verificando cache DNS após a limpeza...
        ipconfig /displaydns
        echo -------------------------------------

        echo | set /p=Libera portas de Wi-Fi e otimiza a rede
        netsh interface tcp set global autotuninglevel=normal
        netsh interface tcp set global chimney=enabled
        netsh interface tcp set global congestioncontrolprovider=ctcp
        netsh interface tcp set global rss=enabled
        netsh int ip set global taskoffload=enabled
        netsh wlan set autoconfig enabled=yes interface="Wi-Fi"
        echo Configurações de rede Wi-Fi otimizadas.
        `;

        const tempFilePath = path.join(os.tmpdir(), `optimizeNetwork_${Date.now()}.bat`);

        try {
            fs.writeFileSync(tempFilePath, batScript);
        } catch (err) {
            console.error("Erro ao criar o arquivo BAT:", err);
            reject({ situacao: 'error', codigo: 'BAT_CREATION_ERROR', mensagem: 'Erro ao criar o arquivo BAT' });
            return;
        }

        const command = spawn('C:\\Windows\\System32\\cmd.exe', ['/c', tempFilePath], { shell: true });

        command.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        command.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        command.on('close', async (code) => {
            if (code === 0) {
                console.log('Comando executado com sucesso');
                resolve({ situacao: 'success', codigo: 'OK', mensagem: 'Internet otimizada com sucesso' });
            } else {
                console.error(`Processo terminou com código ${code}`);
                reject({ situacao: 'error', codigo: `PROCESS_EXIT_CODE_${code}`, mensagem: 'Erro ao executar o processo' });
            }

            // Remove o arquivo temporário
            try {
                fs.unlinkSync(tempFilePath);
                console.log("Arquivo temporário excluído.");
            } catch (err) {
                console.error("Erro ao excluir o arquivo temporário:", err);
            }
        });
    });
}

// Registro de handler com ipcMain.handle para invocar otimização
ipcMain.handle('otimizarInternetCompleto', async (event) => {
    try {
        const resultado = await otimizarInternetCompleto(event);
        return resultado; // Retorna o resultado para o renderer
    } catch (error) {
        return error; // Retorna o erro caso ocorra
    }
});

// Função para mudar o tema do Windows (Claro ou Escuro)
async function mudarTemaWindows(tema) {
    try {
        // Definir o comando PowerShell baseado no tema desejado
        const command = tema === 'escuro'
            ? `${powerShellPath} -WindowStyle Hidden -Command "Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize' -Name 'AppsUseLightTheme' -Value 0"`
            : `${powerShellPath} -WindowStyle Hidden -Command "Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize' -Name 'AppsUseLightTheme' -Value 1"`;

        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error(`Erro ao mudar o tema: ${stderr}`);
            } else {
                console.log(`Tema do Windows alterado para ${tema}!`);
            }
        });
    } catch (error) {
        console.error('Erro ao tentar mudar o tema:', error);
    }
}

// IPC para mudar o tema do Windows
ipcMain.on('mudarTemaWindows', (event, tema) => {
    mudarTemaWindows(tema);
});

// IPC para comunicação com o frontend
ipcMain.on('desfragmentarDisco', desfragmentarOtimizarDisco);
ipcMain.on('verificarIntegridade', verificarIntegridade);
ipcMain.on('limparCacheDNS', limparCacheDNS);

// IPC para obter dados de CPU e RAM
ipcMain.handle('obterUsoCPU', async () => {
    return await obterUsoCPU();
});

ipcMain.handle('obterUsoRAM', async () => {
    return await obterUsoRAM();
});

// IPC para desinstalar o Copilot
ipcMain.on('desinstalarCopilot', desinstalarCopilot);