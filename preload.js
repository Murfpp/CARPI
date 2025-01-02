// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  runPython: (scriptName) => ipcRenderer.invoke('run-python', scriptName)
});
