const Sequelize = require('sequelize')
const connection = require('./database.js')

const Bloqueios = connection.define('Bloqueios',{
    Nome:{
    type: Sequelize.TEXT,
    allownull: false
    },
    IdCadastro:{
        type: Sequelize.INTEGER,
    allownull: false
    },
    DataFim:{
        type: Sequelize.INTEGER,
    allownull: false
    }
})
Bloqueios.sync({force: false}).then(() => {
    console.log("Sincronismo OK com a tabela Bloqueios")
})

module.exports=Bloqueios