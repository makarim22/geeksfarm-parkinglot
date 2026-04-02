const { Model, DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  

class User extends Model {  
  static associate(models) {  
    User.belongsTo(models.Role, { foreignKey: 'roleId' }); // Defines the many-to-one relationship  
    User.hasMany(models.Booking, { foreignKey: 'userId' }); // Defines the one-to-many relationship  
  }  
}  

// Initialize the User model  
User.init(  
  {  
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
      defaultValue: 100000.0, // Optional: set a default value  
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
  },  
  {  
    sequelize,  
    modelName: "User",  
    tableName: "users",  
    timestamps: true,  
  }  
);  

module.exports = User;