const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('../entities/Patient');

class Insurance {
  constructor() {
    this.model = sequelize.define('Insurance', {
      Policy_Number: {
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
      Ins_Code: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      End_Date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      Provider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Coverage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 100,
        }
      },
    }, {
      tableName: 'insurance', 
      timestamps: false,              
    });
  }

  getModel() {
    return this.model;
  }
}

// Create an instance and define associations outside of the constructor
const insuranceModel = new Insurance().getModel();
insuranceModel.belongsTo(Patient, { foreignKey: 'Patient_ID' });
Patient.hasMany(insuranceModel, {foreignKey: 'Patient_ID'});
module.exports = insuranceModel;
