const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');  // Import User model

class VerificationCode {
    constructor() {
        this.model = sequelize.define('VerificationCode', {
            id: {  // ✅ Keep this as the primary key
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {  // ✅ Foreign key to Users table
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: User,
                    key: 'user_id'
                },
                onDelete: 'CASCADE'
            },
            email: {  // ✅ Keep for sending verification messages
                type: DataTypes.STRING,
                allowNull: false,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            expiration: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        }, {
            tableName: 'VerificationCodes',
            timestamps: false,
        });

        // ✅ Associate using user_id instead of email
        this.model.belongsTo(User, { foreignKey: 'user_id', targetKey: 'user_id' });
    }

    getModel() {
        return this.model;
    }
}

module.exports = new VerificationCode().getModel();
