const { DataTypes } = require('sequelize'); // Import DataTypes for defining model fields
const sequelize = require('../config/database'); // Import the Sequelize instance

class Department {
  constructor() {
    this.model = sequelize.define('Department', {
      Dept_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Dept_head: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Dept_name: {
        type: DataTypes.STRING, // Changed to STRING to match the expected type for names
        allowNull: false,
      },
      Emp_Count: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    }, {
      tableName: 'department',
      timestamps: false,
    });
  }

  getModel() {
    return this.model;
  }
}

module.exports = new Department().getModel();
