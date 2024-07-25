/* Arquivo : app.js
* Descrição: Arquivo principal e responsável pela execução da aplicação
* Data de Criação: 25/07/2024
* Autor: Bruno Crespo Ferreira
* 
* Versão: 0.0.1
* Modificado: 25/07/2014 por Bruno
*/

const express = require('express')

const app = express()

const port = process.env.PORT

app.get('/', (req, res) => {
    try {
        res.status(200).send({
            success: 'true',
            message: 'Bem-Vindo(a) ao Servidor!',
            version: '0.0.1'
        })
    } catch (e) {
        res.status(500).send({
            success: 'false',
            message: 'Erro ao chamar o Servidor',
            version: '0.0.1'
        })
    }
})

app.listen(port)
console.log(`Aplicação executando na porta ${port}`)