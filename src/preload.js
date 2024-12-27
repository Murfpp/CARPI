// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  deleteTempFiles: () => ipcRenderer.invoke('deletar-arquivos-temporarios')
});
