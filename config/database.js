const { Sequelize } = require('sequelize');  
require('dotenv').config();  

const sequelize = new Sequelize(process.env.DATABASE_URL, {  
    dialect: 'postgres',
    dialectModule: require('pg'),
    logging: false // Optional: suppress logs
});  

module.exports = sequelize;