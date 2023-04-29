import jwt from 'jsonwebtoken';

import { User } from '../models/User.js';

export const identifyUser = async(request, response, next) => {

    const token = request.cookies._token;

    if(token == null){
        request.user = null;
        return next();
    }

    // verify token 
    try {

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY);
        const user = await User.scope('removePassword').findByPk(decoded.id);

        if(user != null){
            request.user = user;
        }
        return next();

    } catch (error) {
        return response.clearCookie('_token').redirect('/auth/login');
    }
}