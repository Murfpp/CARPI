function limparArquivosTemporarios() {
    window.api.runPython('limpar_temp.py')
        .then(result => {
            alert(`[Python]: ${result}`);
        })
        .catch(err => {
            console.error('Erro Python:', err);
            alert('Erro ao executar o script Python: ' + err.message);
        });
}

document.getElementById('limpar-temp').addEventListener('click', limparArquivosTemporarios);
