import { db } from '../config/database.js';
import { DataTypes } from 'sequelize';

export const Article = db.define('articles',{
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'default.jpg'
    }
});