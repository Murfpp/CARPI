// components/DeleteTemp.js

const fs = require('fs');
const path = require('path');

const deletarPastaRecursivamente = (caminhoPasta, resultado) => {
    if (fs.existsSync(caminhoPasta)) {
        fs.readdirSync(caminhoPasta).forEach((arquivo) => {
            const caminhoAtual = path.join(caminhoPasta, arquivo);
            try {
                if (fs.lstatSync(caminhoAtual).isDirectory()) {
                    // Recursivamente apaga o conteúdo do subdiretório
                    deletarPastaRecursivamente(caminhoAtual, resultado);
                    fs.rmdirSync(caminhoAtual); // Remove o subdiretório vazio
                } else {
                    // Apaga o arquivo
                    fs.unlinkSync(caminhoAtual);
                }
            } catch (err) {
                if (err.code === 'EBUSY') {
                    resultado.erros.push({ arquivo: caminhoAtual, erro: 'Arquivo ou pasta em uso' });
                } else {
                    resultado.erros.push({ arquivo: caminhoAtual, erro: err.message });
                }
            }
        });

        try {
            // Após esvaziar a pasta, tente removê-la
            fs.rmdirSync(caminhoPasta);
        } catch (err) {
            resultado.erros.push({ arquivo: caminhoPasta, erro: err.message });
        }
    }
};

module.exports = deletarPastaRecursivamente;
