const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('../entities/Patient');
const Doctor = require('../entities/Doctor');

class Visit {
  constructor() {
    this.model = sequelize.define('Visit', {
      Visit_ID: {
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
      Doctor_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Doctor,
          key: 'Doctor_ID',
        },
      },
      date_of_visit: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      condition: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      therapy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      tableName: 'visits',
      timestamps: false,
    });
  }

  getModel() {
    return this.model;
  }
}

const visitModel = new Visit().getModel();
visitModel.belongsTo(Patient, { foreignKey: 'Patient_ID' });
visitModel.belongsTo(Doctor, { foreignKey: 'Doctor_ID' });
Patient.hasOne(visitModel, { foreignKey: 'Patient_ID' });
Doctor.hasOne(visitModel, { foreignKey: 'Doctor_ID' });
module.exports = visitModel;
