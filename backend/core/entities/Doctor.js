
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');// Import the Sequelize instance
const Staff = require('../../core/entities/Staff'); // Import Staff model for association

class Doctor extends Staff{
  constructor() {
    super();
    this.model = sequelize.define('Doctor', {
      Doctor_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Qualifications: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Emp_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'staff',
          key: 'Emp_ID',
        },
      },
      Specialization: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }, {
      tableName: 'doctor',
      timestamps: false,
    });

    // Associations
    this.model.belongsTo(Staff, { foreignKey: 'Emp_ID' });
    Staff.hasOne(this.model, { foreignKey: 'Emp_ID' });
  }

  getModel() {
    return this.model;
  }
}

module.exports = new Doctor().getModel();