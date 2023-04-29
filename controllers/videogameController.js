import { Op } from 'sequelize';

import { Category } from '../models/Category.js';
import { Article, Videogame } from '../models/index.js';
import { check } from 'express-validator';

export const createVideogameForm = async(request, response) => {

    const categories = await Category.scope('removeExtraData').findAll({
        order: [['title', 'DESC']]
    });

    return response.render('videogames/create_videogame',{
        page: 'Add videogame',
        user: request.user,
        categories: categories,
        actionUrl:`/videogames/create?_csrf=${request.csrfToken()}`
    });
}

export const saveVideogame = async(request, response) => {

    const newVideogame = new Videogame();

    const { name, description, category } = request.body;

    const videogame = await Videogame.findOne({
        where: {
            name: name.toLowerCase()
        }
    });

    let errors = [];

    if (videogame != null){
        errors.push({msg: 'Videogame with this name already exists'});
    }

    if(name == undefined || name == ''){
        errors.push({msg: 'Field name is required'});
    }

    if(description == undefined || description == ''){
        errors.push({msg: 'Field category is required'});
    }

    if(category == null || category == ''){
        errors.push({msg: 'Select a valid category'});
    }

    if(errors.length != 0){

        const categories = await Category.scope('removeExtraData').findAll({
            order: [['title', 'DESC']]
        });

        return response.render('videogames/create_videogame',{
            page: 'Add videogame',
            user: request.user,
            categories: categories,
            errors: errors,
            actionUrl:`/videogames/create?_csrf=${request.csrfToken()}`
        });
    }

    newVideogame.name = name.toLowerCase();
    newVideogame.description = description;
    newVideogame.categoryId = category;
    newVideogame.userId = request.user.id;

    if(request.file != undefined){
        newVideogame.image = request.file.filename;
    }else{
        newVideogame.image = 'default.jpg';
    }

    await newVideogame.save();

    return response.render('generic/success',{
        page: 'Videogame created',
        message: `The videogame ${newVideogame.name} was created successfully`,
        user: request.user
    });

}

export const videogamesByCategory = async(request, response) => {
    try {
        
        const { categoryId } = request.params;

        const { page } = request.query;

        const limit = 8;
        const offset = limit*(page == undefined ? 0 : Number(page));

        const category = await Category.findAll({
            where: {
                id: categoryId
            }
        });

        if(category == null){
            return response.render('generic/not_found',{page: 'Not Found', user: request.user});
        }

        const [videogames, total] = await Promise.all([
            Videogame.findAll({
                where: {
                    categoryId: categoryId
                },
                limit: limit,
                offset: offset
            }),
            Videogame.count({
                where: {
                    categoryId: categoryId
                }
            })
        ]);

        const totalPages = Math.ceil(total/limit);

        let content = true;

        if(videogames.length == 0){
            content = false;
        }

        return response.render('videogames/videogames_by_category',{
            user: request.user,
            videogames: videogames,
            totalPages: totalPages,
            currentPage: page == undefined ? 0 : Number(page),
            content,
            categoryId,
            page: 'Results'
        });

    } catch (error) {
        return response.redirect('/');
    }
}


export const allVideogames = async(request, response) => {

    const { kword, page } = request.query;

    const limit = 6;
    const offset = limit*(page == undefined ? 0 : page);

    if(kword == undefined){
        const [videogames, total] = await Promise.all([
            Videogame.findAll({
                limit: limit,
                offset: offset,
                order: [['name', 'ASC']]
            }),
            Videogame.count()
        ]);

        const totalPages = Math.ceil(total/limit);

        let content = true;

        if(total == 0){
            content = false;
        }

        return response.render('videogames/all_videogames',{
            user: request.user,
            page: 'All videogames',
            videogames: videogames,
            currentPage: (page == undefined ? 0 : Number(page)),
            totalPages: totalPages,
            kword: '',
            content
        });
    }

    const [videogames, total] = await Promise.all([
        Videogame.findAll({
            where: {
                [Op.or]: [
                {
                    name: {
                        [Op.like]: `%${kword}%`
                    }
                }]
            },
            limit: limit,
            order: [['name', 'ASC']],
            offset: offset
        }),
        Videogame.count({
            where: {
                [Op.or]: [{
                    name: {
                        [Op.like]: `%${kword}%`
                    }
                }]
            }
        })
    ]);

    let content = true;

    if(total == 0){
        content = false;
    }

    const totalPages = Math.ceil(total/limit);

    return response.render('videogames/all_videogames',{
        user: request.user,
        page: 'All videogames',
        videogames: videogames,
        currentPage: (page == undefined ? 0 : Number(page)),
        totalPages: totalPages,
        kword: (kword == undefined ? '' : kword),
        content
    });
}

export const myVideogames = async(request, response) => {
    try {

        const { error } = request.query;

        const { kword, page } = request.query;

        const limit = 6;
        const offset = limit*(page == undefined ? 0 : page);
        
        // find videogames
        const [videogames, total] = await Promise.all([
            Videogame.findAll({
                where:{
                    userId:request.user.id
                },
                limit: limit,
                offset: offset,
                order: [['name', 'ASC']]
            }),
            Videogame.count({
                where:{
                    userId:request.user.id
                }
            })
        ]);

        let content = true;

        if(total == 0){
            content = false;
        }

        const totalPages = Math.ceil(total/limit);

        if(error != undefined){
            return response.render('videogames/my_videogames',{
                page: 'My videogames',
                user: request.user,
                videogames: videogames,
                currentPage: (page == undefined ? 0 : Number(page)),
                totalPages: totalPages,
                kword: (kword == undefined ? '' : kword),
                content,
                csrfToken: request.csrfToken(),
                error: 'You cannot remove a videogame that contains active articles'
            });
        }

        return response.render('videogames/my_videogames',{
            page: 'My videogames',
            user: request.user,
            videogames: videogames,
            currentPage: (page == undefined ? 0 : Number(page)),
            totalPages: totalPages,
            kword: (kword == undefined ? '' : kword),
            content,
            csrfToken: request.csrfToken()
        });


    } catch (error) {
        return response.redirect('/');
    }
}

export const removeVideogame = async(request, response) => {

    const { videogameId } = request.body;

    // validate videogame
    const videogame = await Videogame.findByPk(videogameId);

    if(videogame == null){
        return response.redirect('/videogames/my-videogames');
    }

    // validate permissions
    if(videogame.userId.toString() != request.user.id.toString()){
        return response.redirect('/videogames/my-videogames');
    }

    // verify if the videogame contains articles
    const totalArticles = await Article.count({
        where:{
            videogameId:videogame.id
        }
    });

    if(totalArticles > 0){
        return response.redirect(`/videogames/my-videogames?error=t`);
    }

    // remove videogame
    await videogame.destroy();

    return response.redirect('/videogames/my-videogames');
}

export const updateVideogame = async(request, response) => {
    try {

        const { videogameId } = request.query;
        
        const videogame = await Videogame.findByPk(videogameId);

        if(videogame == null){
            return response.redirect('/videogames/my-videogames');
        }

        if(videogame.userId.toString() != request.user.id){
            return response.redirect('/');
        }

        const categories = await Category.scope('removeExtraData').findAll({
            order: [['title', 'DESC']]
        });

        console.log(videogame.categoryId);
    
        return response.render('videogames/create_videogame',{
            page: 'Update videogame',
            user: request.user,
            categories: categories,
            actionUrl:`/videogames/update?_csrf=${request.csrfToken()}`,
            data: videogame
        });

    } catch (error) {
        return response.redirect('/');
    }
}

export const update = async(request, response) => {

    try {
        
        const { name, description, category, videogameId } = request.body;

        const videogame = await Videogame.findByPk(videogameId);

        if(name != undefined && name != ''){
            const currVideogame = await Videogame.findOne({
                where:{
                    name:name.toLowerCase()
                }
            });

            if(currVideogame == null){
                videogame.name = name != undefined && name != ''? name : videogame.name;
            }
        }

        console.log(category);

        videogame.description = description != undefined && description != ''? description : videogame.description;
        videogame.categoryId = category != undefined && category != ''? category : videogame.categoryId;        

        if(request.file != undefined){
            videogame.image = request.file.filename;
        }

        await videogame.save();

        return response.render('generic/success',{
            page: 'Videogame updated',
            message: `The videogame ${videogame.name} has been updated successfully`,
            user: request.user
        });

    } catch (error) {
        console.log(error);
        return response.redirect('/');
    }

}