import { DataTypes } from 'sequelize';
import { db } from '../config/database.js';
import bcrypt from 'bcrypt';

export const User = db.define('users',{
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    confirmation_code: {
        type: DataTypes.STRING
    },
    enabled: {
        type: DataTypes.BOOLEAN
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true
    }

}, {
    hooks: {
        beforeCreate: async function(user) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    },
    scopes: {
        removePassword:{
            attributes: {
                exclude:['password', 'confirmation_code', 'enabled', 'createdAt', 'updatedAt']
            }
        }
    }
})

// validate password
User.prototype.verifyPassword = function(password){
    return bcrypt.compareSync(password, this.password);
} 