import { db } from '../config/database.js';
import { DataTypes } from 'sequelize';

export const Category = db.define('categories',{
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cover_image: {
        type: DataTypes.STRING,
        defaultValue: 'default.jpg'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
},{
    scopes: {
        removeExtraData: {
            attributes: {
                exclude: ['cover_image', 'description', 'createdAt, updatedAt']
            }
        }
    }
});