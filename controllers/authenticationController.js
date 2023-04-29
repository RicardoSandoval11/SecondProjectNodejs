import bcrypt from 'bcrypt';
import { check, validationResult } from "express-validator";

import { activateAccountRegister, recoverPasswordEmail } from '../helpers/emails.js';
import { generateTokenConfirmation, generateAuthToken } from '../helpers/tokens.js';
import { User } from "../models/User.js";

const RegisterForm = async(request, response) => {

    return response.render('auth/register',{
        page: 'Create account',
        csrfToken: request.csrfToken()
    });

}

const CreateAccount = async(request, response) => {

    // validate fields
    await check('name').notEmpty().withMessage('The name cannot be empty').run(request);
    await check('email').isEmail().withMessage('Invalid email').run(request);
    await check('password').isLength({ min: 8 }).withMessage('The password must contain at least 8 characters').run(request);
    await check('password_confirmation').not().equals('password').withMessage('Passwords are different').run(request);

    let result = validationResult(request);

    if(!result.isEmpty()){
        return response.render('auth/register',{
            page: 'Create account',
            csrfToken: request.csrfToken(),
            errors: result.array()
        });
    }

    if(request.body.password != request.body.password_confirmation){
        return response.render('auth/register',{
            page: 'Create account',
            csrfToken: request.csrfToken(),
            errors: [{ msg: 'Passwords are different' }]
        });
    }

    // verify the email address does not exists
    const user = await User.findOne({
        where: {
            email: request.body.email
        }
    });

    if(user != null){
        return response.render('auth/register',{
            page: 'Create account',
            csrfToken: request.csrfToken(),
            errors: [{ msg: 'Email address already exists' }]
        });
    }

    // send activate account email
    try {

        const newUser = new User();

        const { name, email, password } = request.body;

        newUser.name = name;
        newUser.email = email;
        newUser.password = password;

        if(request.file != null){
            newUser.photo = request.file.fileName;
        }else{
            newUser.photo = 'default.jpg';
        }

        // confirmation token
        const tokenActivation = generateTokenConfirmation();

        newUser.enabled = false;
        newUser.confirmation_code = tokenActivation;

        await newUser.save();

        // send email
        activateAccountRegister(name, email, tokenActivation);

        return response.render('auth/auth-msg',{
                page: 'Create account success',
                message: 'We have sent to your email address an email with the code that you can activate your account.'
        });

    } catch (error) {
        console.log(error.message);
    }

}


const ActivateAccountForm = async(request, response) => {

    let validCode = true;

    const {token} = request.params;

    // find a user with this token
    const user = await User.findOne({
        where: {
            confirmation_code: token
        }
    });

    if(user == null){
        validCode = false;
    }

    return response.render('auth/activate-account',{
        page: 'Activate account',
        csrfToken: request.csrfToken(),
        validCode: validCode,
        message: 'Invalid Url'
    });

}

const ActivateAccount = async(request, response) => {

    const { code }= request.body;

    // find user
    const user = await User.findOne({
        where: {
            confirmation_code: code
        }
    });

    if(user == null){
        return response.render('auth/activate-account',{
            page: 'Activate account',
            csrfToken: request.csrfToken(),
            validCode: true,
            errors: [{ msg: 'The code is not correct' }]
        });
    }

    // activate account
    user.confirmation_code = null;
    user.enabled = true;

    await user.save();

    return response.render('auth/auth-msg',{
        page: 'Activate account success',
        message: 'Your account has been activated successfully.'
    })

}

const LoginForm = async(request, response) => {
    
    return response.render('auth/login_form',{
        page: 'Login',
        csrfToken: request.csrfToken()
    });

}

const Login = async(request, response) => {

    try {

        await check('email').isEmail().withMessage('Type a valid email').run(request);

        await check('password').notEmpty().withMessage('Type a valid password').run(request);

        let result = validationResult(request);

        if(!result.isEmpty()){

            return response.render('auth/login_form', {
                page: 'Login',
                csrfToken: request.csrfToken(),
                errors: result.array()
            });
            
        };

        const { email, password } = request.body;

        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if(user == null){
            return response.render('auth/login_form', {
                page: 'Login',
                csrfToken: request.csrfToken(),
                errors: [{ msg: 'Wrong credentials' }]
            });
        }

        if(!user.enabled){
            return response.render('auth/login_form', {
                page: 'Login',
                csrfToken: request.csrfToken(),
                errors: [{ msg: 'This account has not been activated' }]
            });
        }

        console.log(user.verifyPassword(password));

        if(!user.verifyPassword(password)){
            return response.render('auth/login_form', {
                page: 'Login',
                csrfToken: request.csrfToken(),
                errors: [{ msg: 'Wrong credentials' }]
            });
        }

        const token = generateAuthToken(user.id, user.email);

        return response.cookie('_token', token, {
            httpOnly: true,
            //secure: true, --> With SSL certificate
            //sameSite: true --> With SSL certificate
        }).redirect('/');

    } catch (error) {
        console.log(error);
    }

}

const RecoverPasswordForm = async(request, response) => {

    return response.render('auth/recover-password',{
        page: 'Recover password',
        csrfToken: request.csrfToken()
    });
}

const RecoverPassword = async(request, response) => {

    try {

        const { email } = request.body;
        
        // verify user exists
        const user = await User.findOne({
            where: {
                email:email
            }
        });

        if(user == null){
            return response.render('auth/recover-password',{
                page: 'Recover password',
                csrfToken: request.csrfToken(),
                errors: [{ msg: 'User with this email address does not exist' }]
            });
        }

        // generate token
        const token = generateTokenConfirmation();
        user.confirmation_code = token;

        await user.save();

        // send email
        recoverPasswordEmail(email, token);

        return response.render('auth/auth-msg',{
            page: 'Email Sent',
            message: 'We have sent you an email with the instructions for you to recover your password.'
        });

    } catch (error) {
        console.log(error);
    }
}

const UpdatePasswordForm = async(request, response) => {

    const {token} = request.params;

    try {
        
        // find user by token
        const user = await User.findOne({
            where: {
                confirmation_code:token
            }
        });

        if(user == null){
            return response.render('auth/update_password',{
                page: 'Update password',
                message: 'Invalid Url',
                validCode: false
            });
        }

        return response.render('auth/update_password',{
            page: 'Update password',
            validCode: true,
            csrfToken: request.csrfToken(),
            token: token
        });

    } catch (error) {
        console.log(error);
    }

}

const UpdatePassword = async(request, response) => {

    try {

        const { password, confirm_password, token } = request.body;

        await check('password').isLength({ min: 8 }).withMessage('The password must contain at least 8 characters').run(request);

        let result = validationResult(request);

        if(!result.isEmpty()){
            return response.render('auth/update_password',{
                page: 'Update password',
                validCode: true,
                csrfToken: request.csrfToken(),
                errors: result.array()
            });
        }

        if(password !== confirm_password){
            return response.render('auth/update_password',{
                page: 'Update password',
                validCode: true,
                csrfToken: request.csrfToken(),
                errors: [{ msg: 'Passwords are different' }]
            });
        }

        // update user password
        const user = await User.findOne({
            where: {
                confirmation_code:token
            }
        });

        user.confirmation_code = null;

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        return response.render('auth/auth-msg',{
            page: 'Password Updated',
            message: 'Your password has been updated successfully'
        });

    } catch (error) {
        console.log(error);
    }

}

const Logout = (request, response) => {
    if(request.user == null){
        return response.redirect('/auth/login');
    }
    return response.clearCookie('_token').redirect('/auth/login');
}

export {
    ActivateAccountForm,
    ActivateAccount,
    CreateAccount,
    Login,
    LoginForm,
    Logout,
    RecoverPasswordForm,
    RecoverPassword,
    RegisterForm,
    UpdatePasswordForm,
    UpdatePassword
}