const Sequelize = require('sequelize')
const connection = require('./database.js')

const Motivos = connection.define('Motivos',{
    Nome:{
    type: Sequelize.TEXT, 
    allownull: false
    }
})
Motivos.sync({force: false}).then(() => {
    console.log("Sincronismo OK com a tabela Motivos")
})

module.exports=Motivos