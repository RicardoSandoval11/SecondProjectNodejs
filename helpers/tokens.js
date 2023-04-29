import jwt from 'jsonwebtoken';

export const generateTokenConfirmation = () => {

    return Date.now().toString(32) + Math.random().toString(32).substring(2);
}

export const generateAuthToken = (id, email) => {

    const token = jwt.sign({
        id: id,
        email: email
    }, process.env.ACCESS_TOKEN_PRIVATE_KEY,{
        expiresIn: '2d'
    });
    
    return token;
}