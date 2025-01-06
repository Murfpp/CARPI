const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    limparTemp: () => ipcRenderer.invoke('limparTemp'),
    desfragmentarDisco: () => ipcRenderer.send('desfragmentarDisco'),
    monitorarPerformance: () => ipcRenderer.send('monitorarPerformance'),
    limparCacheDNS: () => ipcRenderer.send('limparCacheDNS'),
    obterUsoCPU: () => ipcRenderer.invoke('obterUsoCPU'),
    obterUsoRAM: () => ipcRenderer.invoke('obterUsoRAM'),
    verificarIntegridade: () => ipcRenderer.send('verificarIntegridade'),
    desinstalarCopilot: () => ipcRenderer.send('desinstalarCopilot'),
    deixarModoEscuro: () => ipcRenderer.send('mudarTemaWindows', 'escuro'),
    deixarModoClaro: () => ipcRenderer.send('mudarTemaWindows', 'claro'),
    otimizarInternetCompleto: () => ipcRenderer.invoke('otimizarInternetCompleto') // Usando ipcRenderer.invoke
});
