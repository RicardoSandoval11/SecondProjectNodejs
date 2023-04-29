import { db } from '../config/database.js';
import { DataTypes } from 'sequelize';

export const Videogame = db.define('videogames',{
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
},{
    scopes: {
        removeExtraData: {
            attributes: {
                exclude: ['image', 'description', 'categoryId', 'userId']
            }
        }
    }
});