const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    limparTemp: () => ipcRenderer.invoke('limparTemp'),
    obterUsoCPU: () => ipcRenderer.invoke('obterUsoCPU'),
    obterUsoRAM: () => ipcRenderer.invoke('obterUsoRAM'),
    deixarModoEscuro: () => ipcRenderer.send('mudarTemaWindows', 'escuro'),
    deixarModoClaro: () => ipcRenderer.send('mudarTemaWindows', 'claro')
});


contextBridge.exposeInMainWorld('electronAPI', {
    executarComandosAdmin: (comandos) => ipcRenderer.invoke('executar-comandos-admin', comandos)
});
