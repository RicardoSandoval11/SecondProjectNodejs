import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({path:'../.env'});

export const activateAccountRegister = async(name, email, code) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Send email
    await transport.sendMail({
        from: process.env.EMAIL_SENDER,
        to: email,
        subject: 'Activate Account Link',
        text: 'Activate Account In JobsApp',
        html: `<h1 style="text-align:center;">Link</h1><p style="text-align:center;"><a href="${process.env.ACCOUNT_REGISTER_LINK+code}">Click To Open This Link</a></p><h2 style="text-align:center;">Verification Code</h2><p style="text-align:center;">${code}</p>`
    })

}

export const recoverPasswordEmail = async(email, code) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Send email
    await transport.sendMail({
        from: process.env.EMAIL_SENDER,
        to: email,
        subject: 'Recover Password',
        text: 'Recover password in JobsApp',
        html: `<h1 style="text-align:center;">Link</h1><p style="text-align:center;"><a href="${process.env.RECOVER_PASSWORD_LINK+code}">Click To Open This Link</a></p>`
    })

}