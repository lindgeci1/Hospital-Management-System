const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('../entities/Patient');

class PdfReport {
  constructor() {
    this.model = sequelize.define('PdfReport', {
      Report_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      personal_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      report: {
        type: DataTypes.BLOB('long'), // Adjust this based on your needs
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      Patient_ID: {
        type: DataTypes.INTEGER,
        references: {
          model: Patient,
          key: 'Patient_ID',
        },
      },
    }, {
      tableName: 'reports',
      timestamps: false,
    });
  }

  getModel() {
    return this.model;
  }
}

const pdfReportModel = new PdfReport().getModel();
pdfReportModel.belongsTo(Patient, { foreignKey: 'Patient_ID' }); // Define association outside constructor
Patient.hasOne(pdfReportModel, { foreignKey: 'Patient_ID' });
module.exports = pdfReportModel;
