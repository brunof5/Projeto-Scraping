/* Arquivo : app.js
* Descrição: Arquivo principal e responsável pela execução da aplicação
* Data de Criação: 25/07/2024
* Autor: Bruno Crespo Ferreira
* 
* Versão: 0.3.0
* Modificado: 09/08/2024
*/

const express = require('express')
const path = require('path')
const axios = require('axios')
const nodemailer = require('nodemailer')

const app = express()

const port = process.env.PORT

// Configurar o middleware para servir arquivos estáticos da pasta 'html'
app.use(express.static(path.join(__dirname, 'html')))

// Middleware para parsear requisições JSON e formulário URL-encoded
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Estrutura global para armazenar os dados de cadastro
global.eventosCadastrados = []

const currentData = {
    poste: {},
    palpite: {},
    sonho: {}
}

// Fila global para armazenar e-mails a serem enviados
const emailQueue = []
// Flag para controlar o processamento da fila
let isProcessingQueue = false

// Configuração do transportador de e-mail
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    host: 'smtp-mail.outlook.com',
    secure: false,
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        ciphers: "SSLv3"
    }
})

// Função para enviar e-mail
const enviarEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log(`E-mail enviado para ${to}`)
    } catch (error) {
        console.error(`Erro ao enviar e-mail para ${to}`, error)
    }
}

// Função para processar a fila de e-mails
async function processEmailQueue() {
    if (isProcessingQueue) return
    isProcessingQueue = true

    while (emailQueue.length > 0) {
        const { email, subject, text } = emailQueue.shift() // Remove o primeiro item da fila

        await enviarEmail(email, subject, text)
    }

    isProcessingQueue = false
}

// Função para adicionar e-mail à fila e iniciar o processamento se não estive já em andamento
function enqueueEmail(email, subject, text) {
    emailQueue.push({ email, subject, text })
    processEmailQueue()
}

/***** DEU NO POSTE *****/
app.get('/poste', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'poste.html'))
})

app.get('/api/poste', async (req, res) => {
    try {
        const response = await axios.get('http://python-poste:4001/')
        currentData.poste = response.data
        res.json(currentData.poste.data)
    } catch (error) {
        res.status(500).send("Erro ao chamar o microserviço Python - Deu no Poste")
    }
})

/***** PALPITE *****/
app.get('/palpite', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'palpite.html'))
})

app.get('/api/palpite', async (req, res) => {
    try {
        const response = await axios.get('http://python-palpite:4002/')
        currentData.palpite = response.data
        res.json(currentData.palpite.data)
    } catch (error) {
        res.status(500).send("Erro ao chamar o microserviço Python - Palpite")
    }
})

/***** SONHO *****/
app.get('/sonho', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'sonho.html'))
})

app.get('/api/sonho', async (req, res) => {
    try {
        const response = await axios.get('http://python-sonho:4003/')
        currentData.sonho = response.data
        res.json(currentData.sonho.data)
    } catch (error) {
        res.status(500).send("Erro ao chamar o microserviço Python - Sonho")
    }
})

/***** CADASTRO DE EVENTO *****/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'))
})

app.post('/notify', (req, res) => {
    const { name, PPT, PTM, PT, PTV, FED, COR, palpite, sonho, emailCheckbox, sms, telegram, email, phone } = req.body

    const eventos = []
    if (PPT) eventos.push('PPT')
    if (PTM) eventos.push('PTM')
    if (PT) eventos.push('PT')
    if (PTV) eventos.push('PTV')
    if (FED) eventos.push('FED')
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

    // Armazenar dados na estrutura global
    global.eventosCadastrados.push(response.data)

    console.log(`Evento cadastrado: ${JSON.stringify(response.data)}`)

    res.status(200).send(response)
})

/***** ROTA PARA ENVIAR NOTIFICAÇÕES *****/
app.post('/send-notifications', (req, res) => {
    console.log(req.body)

    const { tipo, data, eventos } = req.body

    if (!tipo) {
        return res.status(400).send({
            success: 'false',
            message: 'O tipo de notificação é obrigatório para enviar notificações'
        })
    }

    if (tipo === 'poste') {
        if (global.eventosCadastrados.length === 0) {
            return res.status(400).send({
                success: 'false',
                message: 'Nenhum cadastro encontrado para notificar!'
            })
        }

        const eventoIndices = {
            'PPT': 1,
            'PTM': 2,
            'PT': 3,
            'PTV': 4,
            'FED': 5,
            'COR': 6
        }

        global.eventosCadastrados.forEach((evento) => {
            if (evento.email) {
                const subject = `Deu no Poste - Jogo do Bicho`

                const textoEventos = data.map(row => {
                    const identificador = row[0]
                    const valores = evento.eventos.map(e => {
                        const index = eventoIndices[e]
                        return row[index] !== '0000-0' ? `${e}: ${row[index]}` : null
                    }).filter(val => val !== null)

                    return `${identificador} → ${valores.join(', ')}`
                }).join('\n')

                const text = `Olá ${evento.name}, \n\nSegue abaixo os números sorteados: \n${textoEventos}.\n\nObrigado! Parabéns se ganhou!!`

                enqueueEmail(evento.email, subject, text)
            }
        })

    } else if(tipo === 'palpite') {
        const eventosParaNotificar = global.eventosCadastrados.filter(e => e.palpite === 'Sim')

        if (eventosParaNotificar.length === 0) {
            return res.status(400).send({
                success: 'false',
                message: 'Nenhum evento encontrado para notificar!'
            })
        }

        eventosParaNotificar.forEach((evento) => {
            if (evento.email) {
                const subject = 'Palpite - Jogo do Bicho'
                const text = `Olá ${evento.name}, \n\nSegue o palpite de grupos: ${data.join(', ')}.\n\nBoa sorte!`

                enqueueEmail(evento.email, subject, text)
            }
        })

    } else if(tipo === 'sonho') {
        const eventosParaNotificar = global.eventosCadastrados.filter(e => e.sonho === 'Sim')

        if (eventosParaNotificar.length === 0) {
            return res.status(400).send({
                success: 'false',
                message: 'Nenhum evento encontrado para notificar!'
            })
        }

        eventosParaNotificar.forEach((evento) => {
            if (evento.email) {
                const subject = 'Sonho - Jogo do Bicho'
                const text = `Olá ${evento.name}, \n\nVocê sonhou com: ${data.title}?\n\n${data.description_title}\n\n${data.description}\n\nBicho: ${data.Bicho} - G: ${data.G} - D: ${data.D} - C: ${data.C} - M: ${data.M}`

                enqueueEmail(evento.email, subject, text)
            }
        })

    } else {
        return res.status(400).send({
            success: 'false',
            message: 'O tipo de notificação não existe ou não é suportado'
        })
    }
})

/***** EXECUÇÃO *****/
app.listen(port, () => {
    console.log(`Aplicação executando na porta ${port}`)
})
