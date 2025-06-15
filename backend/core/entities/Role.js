const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UserRole = require('./UserRole');
const User = require('./User');
class Role {
  constructor() {
    this.model = sequelize.define('Role', {
      role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      tableName: 'roles',
      timestamps: true,
    });
    this.model.hasMany(UserRole, { foreignKey: 'role_id' });
    UserRole.belongsTo(this.model, { foreignKey: 'role_id' });  
  }

  getModel() {
    return this.model;
  }
}

module.exports = new Role().getModel();
