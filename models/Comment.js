import { db } from '../config/database.js';
import { DataTypes } from 'sequelize';

export const Comment = db.define('comments',{
    content: {
        type: DataTypes.STRING,
        allowNull: false
    }
});