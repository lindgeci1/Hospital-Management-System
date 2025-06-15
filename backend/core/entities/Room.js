const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient'); 

class Room {
  constructor() {
    this.model = sequelize.define('Room', {
      Room_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Room_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Patient_ID: {
        type: DataTypes.INTEGER,
        references: {
          model: Patient,
          key: 'Patient_ID',
        },
      },
      Room_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    }, {
      tableName: 'room',
      timestamps: false,
    });

    this.model.belongsTo(Patient, { foreignKey: 'Patient_ID' });
    Patient.hasOne(this.model, { foreignKey: 'Patient_ID' }); 
  }

  getModel() {
    return this.model;
  }
}

module.exports = new Room().getModel();
