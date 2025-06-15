const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Patient {
  constructor() {
    this.model = sequelize.define('Patient', {
      Patient_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Personal_Number: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow NULL for later entry
      },
      Patient_Fname: {
        type: DataTypes.STRING,
        allowNull: true, // Allow NULL for later entry
      },
      Patient_Lname: {
        type: DataTypes.STRING,
        allowNull: true, // Allow NULL for later entry
      },
      Joining_Date: {
        type: DataTypes.DATE,
        allowNull: true, // Allow NULL for later entry
      },
      Birth_Date: {
        type: DataTypes.DATE,
        allowNull: true, // Allow NULL for later entry
      },
      Gender: {
        type: DataTypes.STRING,
        allowNull: true, // Allow NULL for later entry
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Phone: {
        type: DataTypes.STRING,
        allowNull: true, // Allow NULL for later entry
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // Must always be linked to a User
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
    }, {
      tableName: 'patient',
      timestamps: false,
    });

    this.model.belongsTo(User, { foreignKey: 'user_id' });
    User.hasOne(this.model, { foreignKey: 'user_id' });
  }

  getModel() {
    return this.model;
  }
}

module.exports = new Patient().getModel();
