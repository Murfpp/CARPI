document.addEventListener('DOMContentLoaded', () => {
    const deleteBtn = document.getElementById('deleteBtn');
    const statusElement = document.getElementById('status');

    if (!deleteBtn || !statusElement) {
        console.error('Elementos deleteBtn ou status não encontrados no DOM.');
        return;
    }

    deleteBtn.addEventListener('click', async () => {
        try {
            deleteBtn.disabled = true; // Evitar cliques repetidos
            statusElement.textContent = 'Processando...';

            const result = await window.electron.deleteTempFiles();

            if (result.success) {
                statusElement.textContent = 'Arquivos temporários apagados com sucesso!';
            } else {
                const errors = Array.isArray(result.errors) 
                ? result.errors.map(err => `Erro ao apagar o arquivo ${err.file || 'desconhecido'}: ${err.error}`).join('\n')
                : 'Nenhum erro específico';            
                statusElement.textContent = `Alguns arquivos não puderam ser apagados devido a um dos seguintes motivos:<br>- Arquivos em uso<br>- Diretórios não vazios<br><br>Tente novamente ou reinicie o computador, se necessário.`;
            }
        } catch (err) {
            statusElement.textContent = `Erro inesperado: ${err.message}. Por favor, tente novamente mais tarde.`;
            console.error(err);
        } finally {
            deleteBtn.disabled = false; // Reabilita o botão para fazer limpeza novamente
        }
    });
});
