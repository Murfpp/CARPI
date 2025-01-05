const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const { exec } = require('child_process');
const si = require('systeminformation');
const path = require('path');

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
    try {
        const command = `${powerShellPath} -WindowStyle Hidden -Command "Remove-Item -Path $env:TEMP\\* -Recurse -Force; Remove-Item -Path C:\\Windows\\Temp\\* -Recurse -Force"`;
        exec(command, (err, stdout, stderr) => {
            if (err) {
                // Verifica se o erro é relacionado a um arquivo ou diretório não encontrado, por exemplo
                if (stderr.includes("Cannot find path")) {
                    console.log("Alguns arquivos não foram encontrados, mas isso não é um erro crítico.");
                } else {
                    console.error(`Erro ao limpar arquivos temporários: ${stderr}`);
                }
            } else {
                console.log('Arquivos temporários limpos com sucesso!');
            }
        });
    } catch (error) {
        console.error('Erro inesperado ao limpar arquivos temporários:', error);
    }
}


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
ipcMain.on('limparTemp', limparTemp);
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