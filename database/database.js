const Sequelize = require('sequelize')
const connection = new Sequelize('celular', 'root', 'admin',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports=connection