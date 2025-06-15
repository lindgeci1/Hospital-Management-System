const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Staff = require('../entities/Staff');

class Payroll {
  constructor() {
    this.model = sequelize.define('Payroll', {
      Account_no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Salary: {
        type: DataTypes.DECIMAL, // No precision specified
        allowNull: false,
      },
      Emp_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Staff,
          key: 'Emp_ID',
        },
      },
    }, {
      tableName: 'Payroll',
      timestamps: false,
    });

    this.model.belongsTo(Staff, { foreignKey: 'Emp_ID' });
    Staff.hasOne(this.model, { foreignKey: 'Emp_ID' });
  }

  getModel() {
    return this.model;
  }
}

module.exports = new Payroll().getModel();
