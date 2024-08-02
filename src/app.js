/* Arquivo : app.js
* Descrição: Arquivo principal e responsável pela execução da aplicação
* Data de Criação: 25/07/2024
* Autor: Bruno Crespo Ferreira
* 
* Versão: 0.2.1
* Modificado: 02/08/2024
*/

const express = require('express')
const path = require('path')

const app = express()

const port = process.env.PORT || 3000

// Configurar o middleware para servir arquivos estáticos da pasta 'html'
app.use(express.static(path.join(__dirname, 'html')))

// Middleware para parsear requisições JSON e formulário URL-encoded
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'))
})

app.post('/notify', (req, res) => {
    const { name, PPT, PTM, PT, PTV, PTN, COR, palpite, sonho, emailCheckbox, sms, telegram, email, phone } = req.body

    const eventos = []
    if (PPT) eventos.push('PPT')
    if (PTM) eventos.push('PTM')
    if (PT) eventos.push('PT')
    if (PTV) eventos.push('PTV')
    if (PTN) eventos.push('PTN')
    if (COR) eventos.push('COR')

    const notificacoes = []
    if (emailCheckbox) notificacoes.push('Email')
    if (sms) notificacoes.push('SMS')
    if (telegram) notificacoes.push('Telegram')

    if(!name || eventos.length == 0 || notificacoes.length == 0) {
        return res.status(400).send({
            success: 'false',
            message: 'Nome e pelo menos um evento e uma via de notificação são obrigatórios!'
        })
    }

    if(notificacoes.includes('Email') && !email) {
        return res.status(400).send({
            success: 'false',
            message: 'E-mail não preenchido!'
        })
    }

    if((notificacoes.includes('SMS') || notificacoes.includes('Telegram')) && !phone) {
        return res.status(400).send({
            success: 'false',
            message: 'Número de telefone não preenchido!'
        })
    }

    const response = {
        success: 'true',
        message: 'Cadastro de Evento foi realizado com sucesso!',
        data: {
            name,
            eventos,
            palpite: palpite ? 'Sim' : 'Não',
            sonho: sonho ? 'Sim' : 'Não',
            email: notificacoes.includes('Email') ? email : '',
            telefone: notificacoes.includes('SMS') || notificacoes.includes('Telegram') ? phone : ''
        }
    }

    console.log(`Evento cadastrado: ${JSON.stringify(response.data)}`)

    res.status(200).send(response)
})

app.post('/jogo', (req, res) => {
    const poste = req.body.data
    console.log('Dados da Tabela Recebidos:', poste)

    // Aqui você pode processar os dados e armazená-los para envio de notificações
    // Por exemplo: saveDataToDatabase(poste)

    res.status(200).send('Dados da tabela recebidos com sucesso.')
})

app.post('/palpite', (req, res) => {
    const palpite = req.body.data
    console.log('Dados do Palpite Recebidos:', palpite)

    // Processar os dados e armazená-los para envio de notificações

    res.status(200).send('Dados do palpite recebidos com sucesso.')
})

app.post('/sonho', (req, res) => {
    const sonho = req.body
    console.log('Dados do Sonho Recebidos:', sonho)

    // Processar os dados e armazená-los para envio de notificações

    res.status(200).send('Dados do sonho recebidos com sucesso.')
})

app.listen(port, () => {
    console.log(`Aplicação executando na porta ${port}`)
})
