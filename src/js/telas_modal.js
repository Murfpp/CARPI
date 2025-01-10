let modal = document.getElementById('myModal');
let contentModal = document.getElementById('content-modal');

document.getElementById('btn_logs_list').addEventListener('click', () => {
    contentModal.innerHTML = `
        <button class="close-logs-btn" id="closeModal">✖</button>
        <div id="log-container" style="margin-top:30px">
            <ul id="logs-list"></ul>
            <hr>
        </div>
    `;
    
    // Recuperar as notificações
    pegarTodasNotificacoes();

    document.getElementById('myModal').classList.add('active');

    // Evento de fechamento
    document.getElementById("closeModal").addEventListener('click', () => {
        modal.classList.remove('active');
        contentModal.innerHTML = '';
    });
});

const pegarTodasNotificacoes = () => {
    // Recupera as notificações do localStorage
    const notifications = JSON.parse(localStorage.getItem('notificacoes')) || [];
    const notificationList = document.getElementById('logs-list');

    // Exibe todas as notificações
    notifications.forEach(notification => {
        const listItem = document.createElement('li');
        const statusClass = notification.status === 'success' ? 'success' : 'error';

        listItem.classList.add(statusClass);
        listItem.innerHTML = `
            <strong>${notification.status === 'success' ? '✅' : '❌'} ${notification.message}</strong><br>
            <small>${new Date(notification.date).toLocaleString()}</small>
        `;
        notificationList.appendChild(listItem);
    });
};