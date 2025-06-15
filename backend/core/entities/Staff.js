const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Department = require('../entities/Department');
const User = require('./User');

class Staff {
  constructor() {
    this.model = sequelize.define('Staff', {
      Emp_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Personal_Number: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow NULL for later entry
      },
      Emp_Fname: {
        type: DataTypes.STRING,
        allowNull: true, // Allow NULL for later entry
      },
      Emp_Lname: {
        type: DataTypes.STRING,
        allowNull: true, // Allow NULL for later entry
      },
      Joining_Date: {
        type: DataTypes.DATE,
        allowNull: true, // Allow NULL for later entry
      },
      Birth_Date: {
        type: DataTypes.DATE,
        allowNull: true, // Allow NULL for later entry
      },
      Gender: {
        type: DataTypes.STRING,
        allowNull: true, // Allow NULL for later entry
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Phone: {
        type: DataTypes.STRING,
        allowNull: true, // Allow NULL for later entry
      },
      Emp_type: {
        type: DataTypes.STRING,
        allowNull: true, // Allow NULL for later entry
      },
      Dept_ID: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow NULL for later entry
        references: {
          model: 'department',
          key: 'Dept_ID',
        },
      },
      Qualifications: {
        type: DataTypes.STRING,
        allowNull: true, // Allow NULL for later entry
      },
      Specialization: {
        type: DataTypes.STRING,
        allowNull: true, // Allow NULL for later entry
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // Must always be linked to a User
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
    }, {
      tableName: 'staff',
      timestamps: false,
    });

    this.model.belongsTo(Department, { foreignKey: 'Dept_ID' });
    Department.hasMany(this.model, { foreignKey: 'Dept_ID' });
    this.model.belongsTo(User, { foreignKey: 'user_id' });
    User.hasOne(this.model, { foreignKey: 'user_id' });
  }

  getModel() {
    return this.model;
  }
}

module.exports = new Staff().getModel();
