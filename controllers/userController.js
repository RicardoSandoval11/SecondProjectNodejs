import { check, validationResult } from "express-validator";

import { User } from "../models/User.js";
import { Article, Favorite } from "../models/index.js";
import { formatDates } from "../helpers/formatDate.js";

export const myAccount = async(request, response) => {

    const [articles, favorites] = await Promise.all([
        Article.findAll({
            where: {
                userId: request.user.id
            },
            limit: 4,
            order:[['updatedAt','DESC']]
        }),
        Favorite.findAll({
            where: {
                userId: request.user.id
            },
            order: [['createdAt', 'DESC']],
            limit: 3,
            include: [
                {model: Article, as: 'article'}
            ]
        })
    ]);

    let emptyArticles = false;

    if (articles.length == 0){
        emptyArticles = true;
    }

    let emptyFavorites = false;

    if (favorites.length == 0){
        emptyFavorites = true;
    }

    return response.render('user/dashboard',{
        page: 'Dashboard',
        user: request.user,
        userArticles: articles,
        empty: emptyArticles,
        emptyFavorites: emptyFavorites,
        favorites: favorites,
        formatDates: formatDates
    });
}

export const updateUserInformation = async(request, response) => {
    try {
        
        const userInformation = await User.findByPk(request.user.id);

        return response.render('user/update_information',{
            page: 'Update my information',
            data: userInformation,
            user: request.user,
            csrfToken: request.csrfToken()
        });


    } catch (error) {
        return response.redirect('/');
    }
}

export const updateInformation = async(request, response) => {

    const { name, email } = request.body;

    await check('email').isEmail().withMessage('Enter a valid email').run(request);

    let validations = validationResult(request);

    if(!validations.isEmpty()){

        const userInformation = await User.findByPk(request.user.id);
        return response.render('user/update_information',{
            page: 'Update my information',
            data: userInformation,
            user: request.user,
            csrfToken: request.csrfToken(),
            errors: validations.array()
        });
    }

    let errors = [];

    if(name == undefined || name == ''){
        errors.push({'msg': 'Field name is required'});
    }

    const user = await User.findOne({
        where:{
            email:email
        }
    });

    if(user != null && user.id.toString() != request.user.id.toString()){
        errors.push({'msg': 'This email cannot be taken'});
    }

    if(errors.length != 0){
        const userInformation = await User.findByPk(request.user.id);
        return response.render('user/update_information',{
            page: 'Update my information',
            data: userInformation,
            user: request.user,
            csrfToken: request.csrfToken(),
            errors: errors
        });
    }

    // update information
    const updatedUser = await User.findByPk(request.user.id);
    updatedUser.name = name?? updatedUser.name;
    updatedUser.email = email?? updatedUser.email;

    if(request.file != undefined){
        updatedUser.photo = request.file.filename;
    }

    await updatedUser.save();

    return response.render('generic/success',{
        page: 'Information updated',
        message: 'Your information has been updated successfully'
    });


}