function desfragmentarDiscos() {
    window.api.runPython('desfragmentar_disco.py')
        .then(result => {
            alert(`[Python]: ${result}`);
        })
        .catch(err => {
            console.error('Erro Python:', err);
            alert('Erro ao executar o script Python: ' + err.message);
        });
}

document.getElementById('desfragmentar-discos')?.addEventListener('click', desfragmentarDiscos);
