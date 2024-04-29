// Importar as dependências
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');

// Inicializar o servidor Express
const app = express();

// Middleware para analisar os dados do formulário
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rota para lidar com o envio do formulário
app.post('/enviar-formulario', (req, res) => {
    // Extrair os dados do corpo da solicitação
    const { nome, endereco, telefone } = req.body;

    // Gerar o número do ticket
    const numeroTicket = gerarNumeroTicket();

    // Enviar o e-mail com os dados do usuário e o número do ticket
    enviarEmail(nome, endereco, telefone, numeroTicket)
        .then(() => {
            res.status(200).send('E-mail enviado com sucesso');
        })
        .catch((error) => {
            console.error('Erro ao enviar e-mail:', error);
            res.status(500).send('Erro ao enviar e-mail');
        });
});

// Configurar o transporte de e-mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'seu-email@gmail.com',
        pass: 'sua-senha'
    }
});

// Função para gerar um número de ticket único
function gerarNumeroTicket() {
    // Verificar se o arquivo de contagem existe
    if (!fs.existsSync('contador.txt')) {
        fs.writeFileSync('contador.txt', '1');
    }

    // Ler o valor atual do contador
    let contador = parseInt(fs.readFileSync('contador.txt', 'utf8'));

    // Incrementar o contador e escrever o novo valor no arquivo
    fs.writeFileSync('contador.txt', (++contador).toString());

    return contador;
}

// Função para enviar o e-mail com os dados do usuário e o número do ticket
function enviarEmail(nome, endereco, telefone, numeroTicket) {
    // Configurar o e-mail
    const mailOptions = {
        from: 'seu-email@gmail.com',
        to: 'empresa@candya.com.br',
        subject: 'Novo Ticket para Galeto Solidário',
        html: `<p>Nome: ${nome}</p><p>Endereço: ${endereco}</p><p>Telefone: ${telefone}</p><p>Número do Ticket: ${numeroTicket}</p>`
    };

    // Enviar o e-mail
    return transporter.sendMail(mailOptions);
}

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
