const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    limparTemp: () => ipcRenderer.invoke('limparTemp'),
    obterUsoCPU: () => ipcRenderer.invoke('obterUsoCPU'),
    obterUsoRAM: () => ipcRenderer.invoke('obterUsoRAM'),
    deixarModoEscuro: () => ipcRenderer.send('mudarTemaWindows', 'escuro'),
    deixarModoClaro: () => ipcRenderer.send('mudarTemaWindows', 'claro'),
    otimizarInternetCompleto: () => ipcRenderer.invoke('otimizarInternetCompleto') // Usando ipcRenderer.invoke
});
