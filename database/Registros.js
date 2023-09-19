const Sequelize = require('sequelize')
const connection = require('./database.js') 

const Registros = connection.define('Registros',{
    IdCadastro:{
        type: Sequelize.INTEGER,
    allownull: false
    },
    Matricula:{
        type: Sequelize.INTEGER,
    allownull: false
    },
    Nome:{
    type: Sequelize.TEXT,
    allownull: false
    },
    DataBloqueio:{
        type: Sequelize.STRING,
    allownull: false
    }
})
Registros.sync({force: false}).then(() => {
    console.log("Sincronismo OK com a tabela Registros")
})

module.exports=Registros