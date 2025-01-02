function otimizarRede() {
    window.api.runPython('otimizar_rede.py')
        .then(result => {
            alert(`[Python]: ${result}`);
        })
        .catch(err => {
            console.error('Erro Python:', err);
            alert('Erro ao executar o script Python: ' + err.message);
        });
}

document.getElementById('otimizar-rede').addEventListener('click', otimizarRede);
