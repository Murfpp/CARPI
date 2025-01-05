function showAlert(msg, type, emoji = '', duration = 5000) {
    const alertContainer = document.getElementById('alert-container');

    // Criar a estrutura do alerta
    const alert = document.createElement('div');
    alert.classList.add('alert', type);

    // Adicionar o emoji e a mensagem
    const emojiSpan = document.createElement('span');
    emojiSpan.classList.add('emoji');

    // Verificar se o emoji foi fornecido
    if (emoji) {
        emojiSpan.textContent = emoji; // Adiciona o emoji
        emojiSpan.style.marginRight = '8px'; // Espaço entre o emoji e a mensagem
        alert.appendChild(emojiSpan);
    }

    // Adicionar a mensagem
    const message = document.createElement('span');
    message.classList.add('message');
    message.textContent = msg;
    alert.appendChild(message);

    // Adicionar a barra de progresso
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    alert.appendChild(progressBar);

    // Definir cor única para a barra de progresso
    progressBar.style.backgroundColor = '#fff';  // Cor única para a barra de progresso

    // Adicionar o alerta ao container
    alertContainer.appendChild(alert);

    // Iniciar a animação da barra de progresso
    setTimeout(() => {
        progressBar.style.transition = `width ${duration}ms linear`; // Garantir que a duração da barra seja igual ao tempo de exibição
        progressBar.style.width = '100%';
    }, 100);

    // Remover o alerta após o tempo determinado
    setTimeout(() => {
        alert.style.opacity = 0;
        setTimeout(() => {
            alertContainer.removeChild(alert);
        }, 500);
    }, duration); // Tempo de duração do alerta
}
