const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,  // Desabilita o isolamento de contexto
            devTools: false,  // Desativa as ferramentas de desenvolvedor
        }
    });

    win.loadFile('src/front/pages/index.html');

    // Impede o uso de atalhos como Ctrl+Shift+I
    win.webContents.on('before-input-event', (event, input) => {
        if (input.control && input.shift && input.key === 'I') {
            event.preventDefault();
        }
    });
}

app.whenReady().then(() => {
    // Remove o menu padrão
    Menu.setApplicationMenu(null);

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Função para limpar arquivos temporários
function limparArquivosTemp() {
    const tempDirUser = path.join(os.homedir(), 'AppData', 'Local', 'Temp');
    const tempDirWindows = 'C:\\Windows\\Temp';
    const tempEnv = process.env.TEMP;  // Diretório %TEMP%

    // Função para excluir arquivos de forma segura
    function excluirArquivo(filePath) {
        try {
            if (fs.lstatSync(filePath).isFile()) {
                fs.unlinkSync(filePath); // Apaga o arquivo
                console.log(`Arquivo apagado com sucesso: ${filePath}`);
            }
        } catch (err) {
            // Ignorar erros de arquivos em uso ou sem permissão
            console.error(`Erro ao tentar apagar o arquivo: ${filePath}`, err);
        }
    }

    // Apagar arquivos temporários do usuário (%TEMP%)
    fs.readdirSync(tempEnv).forEach(file => {
        const filePath = path.join(tempEnv, file);
        excluirArquivo(filePath);
    });

    // Apagar arquivos temporários do usuário (AppData\Local\Temp)
    fs.readdirSync(tempDirUser).forEach(file => {
        const filePath = path.join(tempDirUser, file);
        excluirArquivo(filePath);
    });

    // Apagar arquivos temporários do sistema (C:\Windows\Temp)
    fs.readdirSync(tempDirWindows).forEach(file => {
        const filePath = path.join(tempDirWindows, file);
        excluirArquivo(filePath);
    });

    console.log('Arquivos temporários apagados com sucesso!');
}

// Recebe o evento de click no botão e executa a limpeza de arquivos temporários
ipcMain.on('limpar-arq-temp', () => {
    limparArquivosTemp();
});
