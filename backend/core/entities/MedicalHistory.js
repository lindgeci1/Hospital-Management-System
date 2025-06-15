const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('../entities/Patient');

class MedicalHistory {
  constructor() {
    this.model = sequelize.define('MedicalHistory', {
      Record_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Patient_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Patient,
          key: 'Patient_ID',
        },
      },
      Allergies: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Pre_Conditions: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      tableName: 'medical_history',
      timestamps: false,
    });

    this.model.belongsTo(Patient, { foreignKey: 'Patient_ID' });
    Patient.hasOne(this.model, { foreignKey: 'Patient_ID' });
  }

  getModel() {
    return this.model;
  }
}

module.exports = new MedicalHistory().getModel();
