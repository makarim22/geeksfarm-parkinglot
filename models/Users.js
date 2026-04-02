// models/User.js  
const { DataTypes } = require('sequelize');  
const sequelize = require('../config/database');  

const User = sequelize.define('User', {  
    username: {  
        type: DataTypes.STRING,  
        allowNull: false,  
        unique: true,  
      },  
      password: {  
        type: DataTypes.STRING,  
        allowNull: false,  
      },  
      email: {  
        type: DataTypes.STRING,  
        allowNull: false,  
        unique: true,  
      },  
      coins: {  
        type: DataTypes.FLOAT,  
        defaultValue: 100000, // Optional: set a default value  
        allowNull: true, // Set this to true if you want it optional  
      },  
      roleId: {  // Foreign key to reference Role  
        type: DataTypes.INTEGER,  
        allowNull: true,  
        references: {  
          model: 'roles', // This should match the name of the roles table  
          key: 'id',  
        },  
      },  
    }  
, {  
    tableName: 'users',  
    timestamps: false  
});  

module.exports = User;