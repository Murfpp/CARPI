function monitorarMaquina() {
    window.api.runPython('monitoramento.py')
        .then(result => {
            alert(`[Python]: ${result}`);
        })
        .catch(err => {
            console.error('Erro Python:', err);
            alert('Erro ao executar o script Python: ' + err.message);
        });
}

document.getElementById('monitorar-maquina').addEventListener('click', monitorarMaquina);
