const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


class UserRole {
  constructor() {
    this.model = sequelize.define('UserRole', {
      UserRole_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User', // Reference model by name
          key: 'user_id',
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Role', // Reference model by name
          key: 'role_id',
        },
      },
    }, {
      tableName: 'UserRole',
      timestamps: true,
    });

  }

  getModel() {
    return this.model;
  }
}

module.exports = new UserRole().getModel();
