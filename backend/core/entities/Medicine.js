// backend/core/entities/Medicine.js
const { DataTypes } = require('sequelize'); // Import DataTypes for defining model fields
const sequelize = require('../config/database'); // Import the Sequelize instance
const Patient = require('../entities/Patient'); // Import the Patient model

class Medicine {
  constructor() {
    this.model = sequelize.define('Medicine', {
      Medicine_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      M_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      M_Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      M_Cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      Patient_ID: {
        type: DataTypes.INTEGER,
        references: {
          model: Patient, // Refer to the Patient model directly
          key: 'Patient_ID',
        },
      },
    }, {
      tableName: 'medicine',
      timestamps: false,
    });

    // Set up association with the Patient model
    this.model.belongsTo(Patient, { foreignKey: 'Patient_ID' });
    Patient.hasOne(this.model, { foreignKey: 'Patient_ID' });
  }

  getModel() {
    return this.model;
  }
}

module.exports = new Medicine().getModel();
