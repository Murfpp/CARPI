// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const deletarArqTemp = require('./routes/DeleteArqTemp.js'); // Importe o handler

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'page', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Chama a função que registra o handler para deletar arquivos temporários
deletarArqTemp();
