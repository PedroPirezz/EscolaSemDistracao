const Sequelize = require('sequelize')
const connection = require('./database.js')

const Solicitacoes = connection.define('solicitacoes', {
    Nome: {
        type: Sequelize.STRING,
        allownull: false
    },
    UserID: {
        type: Sequelize.STRING,
        allownull: false
    },
    DataSolicitacao: {
        type: Sequelize.STRING,
        allownull: false 
    },
    Horainicio: {
        type: Sequelize.STRING,
        allownull: false
    },
    HoraTérmino: {
        type: Sequelize.STRING,
        allownull: false
    },
    Motivo: {
        type: Sequelize.STRING,
        allownull: false
    },
    Status: {
        type: Sequelize.STRING,
        allownull: false
    }

})




Solicitacoes.sync({ force: false }).then(() => {
    console.log("Sincronismo OK com a tabela de Solicitaçoes")
})

module.exports = Solicitacoes