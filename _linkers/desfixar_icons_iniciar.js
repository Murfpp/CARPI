function redefinirMenuIniciar() {
    window.api.runPython('desfixar_icons_iniciar.py')
        .then(result => {
            alert(`[Python]: ${result}`);
        })
        .catch(err => {
            console.error('Erro Python:', err);
            alert('Erro ao executar o script Python: ' + err.message);
        });
}

document.getElementById('redefinir-menu-iniciar')?.addEventListener('click', redefinirMenuIniciar);
