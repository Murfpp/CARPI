const { ipcRenderer } = require('electron');

// Função para chamar o backend para apagar os arquivos temporários
function limparTempFiles() {
    ipcRenderer.send('limpar-arq-temp');
}

// Adicionando um evento de clique ao botão
document.getElementById('deleteBtn').addEventListener('click', limparTempFiles);
