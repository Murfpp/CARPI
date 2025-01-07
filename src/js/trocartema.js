// Aguarda o DOM ser completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    const themeToggle = document.getElementById('theme-toggle');

    // Função para aplicar o tema
    function applyTheme(isDarkMode) {
        document.body.classList.toggle('dark-theme', isDarkMode);
        themeToggle.checked = isDarkMode;
    }

    // Aplica o tema com base na preferência do sistema
    applyTheme(prefersDarkMode.matches);

    // Observa mudanças no tema do sistema
    prefersDarkMode.addEventListener('change', (e) => {
        applyTheme(e.matches);
    });

    // Alterna manualmente entre temas
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            showAlert("Tema alterado para escuro com sucesso!", "success", "✔️ ", 2000);
            window.electron.deixarModoEscuro(); // Altera o tema do Windows para escuro
            armazenarMsg('success', 'Tema alterado para escuro'); // Armazena a notificação de mudança de tema
        } else {
            showAlert("Tema alterado para claro com sucesso!", "success", "✔️ ", 2000);
            document.body.classList.remove('dark-theme');
            window.electron.deixarModoClaro(); // Altera o tema do Windows para claro
            armazenarMsg('success', 'Tema alterado para claro'); // Armazena a notificação de mudança de tema
        }
    });
});