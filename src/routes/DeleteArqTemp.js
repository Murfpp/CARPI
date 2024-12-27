const { ipcMain } = require('electron');
const os = require('os');
const deletarPastaRecursivamente = require('../components/DeleteTemp.js'); // Função que importei para deletar

// Handler para deletar arquivos temporários
const deletarArqTemp = () => {
    ipcMain.handle('deletar-arquivos-temporarios', async () => {
        const diretorioTempUsuario = os.tmpdir(); // Diretório de arquivos temporários do usuário
        const diretorioTempSistema = 'C:\\Windows\\Temp'; // Diretório de arquivos temporários do sistema (C:\Windows\Temp)
        
        const resultado = { sucesso: true, erros: [] };

        try {
            // Logs para depuração
            console.log('Deletando arquivos temporários...');
            deletarPastaRecursivamente(diretorioTempUsuario, resultado);
            deletarPastaRecursivamente(diretorioTempSistema, resultado);
        } catch (err) {
            console.error('Erro durante a exclusão dos arquivos:', err);
            resultado.sucesso = false;
            resultado.erros.push({ erro: err.message });
        }

        // console.log('Resultado final:', resultado); < -- Usar para log no futuro seria bem interessante !! Pois ele retorna um object
        return resultado;
    });
};

module.exports = deletarArqTemp;
