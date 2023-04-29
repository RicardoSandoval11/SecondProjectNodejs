import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { User } from '../models/User.js';

dotenv.config({path: '../.env'});

export const protectRoute = async(request, response, next) => {

    // Verify if there is a token
    const { _token } = request.cookies;
    if(!_token){
        return response.redirect('/auth/login');
    }

    // validate token
    try {
        
        const decoded = jwt.verify(_token, process.env.ACCESS_TOKEN_PRIVATE_KEY);

        const user = await User.scope('removePassword').findByPk(decoded.id);

        if (user != null) {
            request.user = user;
        }else {
            return response.redirect('/auth/login');
        }
        return next();

    } catch (error) {
        console.log(error);
        return response.clearCookie('_token').redirect('/auth/login');
    }

}