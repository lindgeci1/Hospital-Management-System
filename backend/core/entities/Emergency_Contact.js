const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('../entities/Patient');

class EmergencyContact {
  constructor() {
    this.model = sequelize.define('EmergencyContact', {
      Contact_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Contact_Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Phone: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Relation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Patient_ID: {
        type: DataTypes.INTEGER,
        references: {
          model: Patient,
          key: 'Patient_ID',
        },
        allowNull: false,
      },
    }, {
      tableName: 'emergency_contact',
      timestamps: false,
    });

    // Define association inside the constructor
    this.model.belongsTo(Patient, { foreignKey: 'Patient_ID' });
    Patient.hasMany(this.model, {foreignKey: 'Patient_ID'});
  }

  getModel() {
    return this.model;
  }
}

module.exports = new EmergencyContact().getModel();
