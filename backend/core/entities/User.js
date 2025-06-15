const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./Role');
const UserRole = require('./UserRole');

class User {
  constructor() {
    this.model = sequelize.define('User', {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      refresh_token_expires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    }, {
      tableName: 'users',
      timestamps: false,
    });
    

    // Define associations
    this.model.hasMany(UserRole, { foreignKey: 'user_id' });
    UserRole.belongsTo(this.model, { foreignKey: 'user_id' });
    UserRole.belongsTo(Role, { foreignKey: 'role_id' });
  }

  getModel() {
    return this.model;
  }
}

module.exports = new User().getModel();
