const { DataTypes } = require('sequelize'); // Import DataTypes for defining model fields
const sequelize = require('../config/database'); // Import the Sequelize instance
const Staff = require('../entities/Staff'); // Import the Staff model for association

class Rating {
  constructor() {
    this.model = sequelize.define('Rating', {
      Rating_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Emp_ID: {
        type: DataTypes.INTEGER,
        references: {
          model: 'staff', // Referencing the staff table
          key: 'Emp_ID', // Changed to match the key in the Staff model
        },
      },
      Rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Comments: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }, {
      tableName: 'rating',
      timestamps: false,
    });

    // Set up the association between Rating and Staff
    this.model.belongsTo(Staff, { foreignKey: 'Emp_ID' });
    Staff.hasOne(this.model, { foreignKey: 'Emp_ID' });
  }

  getModel() {
    return this.model;
  }
}

module.exports = new Rating().getModel();
