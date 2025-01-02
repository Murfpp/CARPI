// main.js
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const { PythonShell } = require('python-shell');
const path = require('node:path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // Melhor prática
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('./index.html');

  // Bloquear Ctrl+Shift+I
  win.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.shift && input.key === 'I') {
      event.preventDefault();
    }
  });
}

// Eventos IPC para execução do Python
ipcMain.handle('run-python', async (event, scriptName) => {
  let options = {
    scriptPath: path.join(__dirname, '_engine'),
    args: []
  };

  try {
    const results = await PythonShell.run(scriptName, options);
    return results;
  } catch (err) {
    console.error('Erro ao executar script Python:', err);
    throw err;
  }
});

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
