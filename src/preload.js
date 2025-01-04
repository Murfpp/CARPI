const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    limparTemp: () => ipcRenderer.send('limparTemp'),
    desfragmentarDisco: () => ipcRenderer.send('desfragmentarDisco'),
    monitorarPerformance: () => ipcRenderer.send('monitorarPerformance'),
    limparCacheDNS: () => ipcRenderer.send('limparCacheDNS'),
    obterUsoCPU: () => ipcRenderer.invoke('obterUsoCPU'),
    obterUsoRAM: () => ipcRenderer.invoke('obterUsoRAM'),
    verificarIntegridade: () => ipcRenderer.send('verificarIntegridade'),
    desinstalarCopilot: () => ipcRenderer.send('desinstalarCopilot'),
    deixarModoEscuro: () => ipcRenderer.send('mudarTemaWindows', 'escuro'),
    deixarModoClaro: () => ipcRenderer.send('mudarTemaWindows', 'claro')
});
