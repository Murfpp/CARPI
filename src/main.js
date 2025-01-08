const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const { exec } = require('child_process');
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

async function criarBatExecutarDepois(comandosExecutar) {
    try {
        const nomeArquivo = `temp_script_${Date.now()}.bat`;
        const caminhoArquivo = path.join(os.tmpdir(), nomeArquivo);

        let conteudoBat = '';
        if (Array.isArray(comandosExecutar)) {
            conteudoBat = comandosExecutar.join('\r\n');
        } else if (typeof comandosExecutar === 'string') {
            conteudoBat = comandosExecutar;
        } else {
            throw new Error("comandosExecutar deve ser um array ou string");
        }

        fs.writeFileSync(caminhoArquivo, conteudoBat, 'utf-8');

        return new Promise((resolve, reject) => {
            exec(`C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -Command "& {Start-Process -Verb RunAs -FilePath '${caminhoArquivo}' -Wait; exit $LASTEXITCODE}"`, { windowsHide: true }, (error, stdout, stderr) => {
                fs.unlink(caminhoArquivo, (err) => {
                    if (err) console.error(`Erro ao apagar o arquivo temporário: ${err}`);
                });

                if (error) {
                    console.error(`Erro ao executar o BAT: ${error}`);
                    reject({ sucesso: false, erro: error.message, codigo: error.code, stderr }); // Inclui o código do erro
                    return;
                }
                if (stderr) {
                    console.error(`Stderr ao executar o BAT: ${stderr}`);
                    reject({ sucesso: false, erro: stderr });
                    return;
                }

                console.log(`Stdout ao executar o BAT: ${stdout}`);
                resolve({ sucesso: true, stdout }); // Resolve com sucesso e stdout
            });
        });
    } catch (error) {
        console.error("Erro na criação/execução do BAT:", error);
        return { sucesso: false, erro: error.message };
    }
}

// IPC para executar comandos com adm
ipcMain.handle('executar-comandos-admin', async (event, comandos) => {
    try {
        const result = await criarBatExecutarDepois(comandos);
        console.log("Resultado do IPC:", result);
        return result;
    } catch (error) {
        console.error("Erro no manipulador IPC:", error);
        return { sucesso: false, erro: error.message, codigo: error.code, stderr: error.stderr };
    }
});

// IPC para mudar o tema do Windows
ipcMain.on('mudarTemaWindows', (event, tema) => {
    mudarTemaWindows(tema);
});

// IPC para obter dados de CPU e RAM
ipcMain.handle('obterUsoCPU', async () => {
    return await obterUsoCPU();
});

ipcMain.handle('obterUsoRAM', async () => {
    return await obterUsoRAM();
});
