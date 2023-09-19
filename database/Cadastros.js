const Sequelize = require('sequelize')
const connection = require('./database.js')

const Cadastros = connection.define('cadastros', {

    Nome: {
        type: Sequelize.STRING,
        allownull: false
    },
    Email: {
        type: Sequelize.STRING,
        allownull: false
    },
    Senha: {
        type: Sequelize.STRING,
        allownull: false
    },
    Token: {
        type: Sequelize.STRING,
        allownull: false
    },
    
})

// const Respostas = connection.define('respostas', {


// })






Cadastros.sync({ force: false }).then(() => {
    console.log("Sincronismo OK com a tabela Cadastros")
})

module.exports = Cadastros