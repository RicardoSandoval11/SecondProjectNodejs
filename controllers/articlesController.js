import { validationResult, check } from "express-validator";

import { Article, Videogame, Comment } from "../models/index.js";
import { formatDates } from '../helpers/formatDate.js';
import { User } from "../models/User.js";
import { Op } from "sequelize";

export const createNewArticle = async(request, response) => {

    const videogames = await Videogame.scope('removeExtraData').findAll({
        order: [['name', 'DESC']]
    });

    return response.render('articles/create_article',{
        page: 'Add article',
        videogames: videogames,
        user: request.user,
        actionUrl:`/articles/save?_csrf=${request.csrfToken()}`
    });

}

export const saveArticle = async(request, response) => {

    try {

    await check('title').notEmpty().withMessage('Title cannot be empty').run(request);
    await check('content').notEmpty().withMessage('Content cannot be empty').run(request);

    const result = validationResult(request);

    if(!result.isEmpty()){

        const videogames = await Videogame.scope('removeExtraData').findAll({
            order: [['name', 'DESC']]
        });

        return response.render('articles/create_article',{
            page: 'Add article',
            videogames: videogames,
            user: request.user,
            actionUrl:`/articles/save?_csrf=${request.csrfToken()}`,
            errors: result.array(),
            title: request.body.title,
            content: request.body.content,
            selectedVideogame: Number(request.body.videogame)
        });

    }

    if (request.body.videogame == undefined){

        const videogames = await Videogame.scope('removeExtraData').findAll({
            order: [['name', 'DESC']]
        });

        return response.render('articles/create_article',{
            page: 'Add article',
            videogames: videogames,
            user: request.user,
            actionUrl:`/articles/save?_csrf=${request.csrfToken()}`,
            errors: [{msg: 'Select a valid videogame'}],
            title: request.body.title,
            content: request.body.content
        });
    }

    const newArticle = new Article();

    if(request.file == undefined){
        newArticle.image = 'default.jpg'
    }else{
        newArticle.image = request.file.filename;
    }

    newArticle.title = request.body.title;
    newArticle.content = request.body.content;
    newArticle.videogameId = request.body.videogame;
    newArticle.userId = request.user.id;

    await newArticle.save();

    return response.render('generic/success',{
        page: 'Article created',
        message: `The article ${newArticle.title} was created successfully`,
        user: request.user
    });
        
    } catch (error) {
        console.log(error);
    }

}

export const articleDetails = async(request, response) => {
    try {
        
        const { articleId } = request.params;

        // find article
        const [article, commentsByArticle] = await Promise.all([
            Article.findByPk(articleId),
            Comment.findAll({
                where: {
                    articleId: articleId,
                },
                include: [
                    {model: User, as: 'user'}
                ],
                order: [['updatedAt', 'DESC']]
            })
        ]); 

        if(article == null){

            return response.render('generic/not_found',{
                page: 'Not found',
                user: request.user
            });

        }

        return response.render('articles/article_details',{
            page: article.title,
            user: request.user,
            article: article,
            formatDates: formatDates,
            csrfToken: request.csrfToken(),
            comments: commentsByArticle
        });

    } catch (error) {
        console.log(error);
    }
}

export const myArticles = async(request, response) => {
    try {
        
        const { page } = request.query;

        const limit = 6;
        const offset = limit*(page == undefined ? 0 : page);

        const [articles, total] = await Promise.all([
            Article.findAll({
                where:{
                    userId: request.user.id
                },
                order: [['updatedAt', 'DESC']],
                limit: limit,
                offset: offset
            }),
            Article.count({
                where: {
                    userId: request.user.id
                }
            })
        ]);

        const totalPages = Math.ceil(total/limit);

        let isContent = true;

        if(total == 0){
            isContent = false;
        }

        return response.render('articles/my_articles',{
            page: 'My articles',
            articles: articles,
            totalPages: totalPages,
            user: request.user,
            isContent: isContent,
            currentPage: Number(page == undefined ? 0 : page),
            csrfToken: request.csrfToken()
        });

    } catch (error) {
        console.log('error');
    }
}

export const updateArticleForm = async(request, response) => {

    const videogames = await Videogame.scope('removeExtraData').findAll({
        order: [['name', 'DESC']]
    });

    const { articleId } = request.params;

    // verify the article exists
    const article = await Article.findByPk(articleId);

    if(article == null){

        return response.render('generic/not_found',{
            page: 'Not found',
            user: request.user
        });

    }

    // verify the owner is who wants to remove the article
    if(article.userId.toString() != request.user.id.toString()){

        return response.redirect('/');

    }


    return response.render('articles/create_article',{
        page: 'Update article',
        videogames: videogames,
        user: request.user,
        actionUrl:`/articles/update?_csrf=${request.csrfToken()}`,
        title: article.title,
        content: article.content,
        selectedVideogame: article.videogameId,
        currentImage: article.image,
        update: true,
        articleId: article.id
    });

}

export const updateArticle = async(request, response) => {

    try {

        console.log(request.body);

        const { articleId } = request.body;

        const article = await Article.findByPk(articleId);

        await check('title').notEmpty().withMessage('Title cannot be empty').run(request);
        await check('content').notEmpty().withMessage('Content cannot be empty').run(request);
    
        const result = validationResult(request);
    
        const { title, content, videogame } = request.body;

        if(!result.isEmpty()){
    
            const videogames = await Videogame.scope('removeExtraData').findAll({
                order: [['name', 'DESC']]
            });

    
            return response.render('articles/create_article',{
                page: 'Update article',
                videogames: videogames,
                user: request.user,
                actionUrl:`/articles/update?_csrf=${request.csrfToken()}`,
                errors: result.array(),
                title: title ?? article.title,
                content: content ?? article.content,
                selectedVideogame: Number(videogame ?? article.videogameId),
                currentImage: article.image,
                update: true,
                articleId: article.id
            });
    
        }

    
        article.title = title ?? article.title;
        article.content = content ?? article.content;
        article.videogame = videogame ?? article.videogameId;
    
        if(request.file != undefined){
            article.image = request.file.filename;
        }
    
        await article.save();
    
        return response.render('generic/success',{
            page: 'Article Updated',
            message: `The article ${article.title} has been updated successfully`,
            user: request.user
        });
            
        } catch (error) {
            console.log(error);
        }

}

export const deleteArticle = async(request, response) => {

    const { articleId } = request.params;

    const article = await Article.findByPk(articleId);

    if(article == null){
        return response.redirect('/articles/my-articles');
    }

    // validate authorities
    if(article.userId.toString() != request.user.id.toString()){
        return response.redirect('/');
    }

    // remove article
    await article.destroy();

    return response.redirect('/articles/my-articles');
}

export const articlesByVideogame = async(request, response) => {
    try {
        
        const { videogameId } = request.params;

        const { page } = request.query;

        const limit = 6;
        const offset = limit*(page == undefined ? 0 : Number(page));

        const videogame = await Videogame.findAll({
            where: {
                id: videogameId
            }
        });

        if(videogame == null){
            return response.render('generic/not_found',{page: 'Not Found', user: request.user});
        }

        const [articles, total] = await Promise.all([
            Article.findAll({
                where: {
                    videogameId: videogameId
                },
                limit: limit,
                offset: offset
            }),
            Article.count({
                where: {
                    videogameId: videogameId
                }
            })
        ]);

        const totalPages = Math.ceil(total/limit);

        let content = true;

        if(articles.length == 0){
            content = false;
        }

        return response.render('articles/articles_by_videogame',{
            user: request.user,
            articles: articles,
            totalPages: totalPages,
            currentPage: page == undefined ? 0 : Number(page),
            content,
            videogameId,
            page: 'Results'
        });

    } catch (error) {
        return response.redirect('/');
    }
}

export const allArticles = async(request, response) => {

    const { kword, page } = request.query;

    const limit = 6;
    const offset = limit*(page == undefined ? 0 : page);

    if(kword == undefined){
        const [articles, total] = await Promise.all([
            Article.findAll({
                limit: limit,
                offset: offset,
                order: [['title', 'ASC']],
                include: [
                    {model: User, as: 'user'}
                ]
            }),
            Article.count()
        ]);

        const totalPages = Math.ceil(total/limit);

        let content = true;

        if(total == 0){
            content = false;
        }

        return response.render('articles/all_articles',{
            user: request.user,
            page: 'All articles',
            articles: articles,
            currentPage: (page == undefined ? 0 : Number(page)),
            totalPages: totalPages,
            kword: '',
            formatDates,
            content
        });
    }

    const [articles, total] = await Promise.all([
        Article.findAll({
            where: {
                [Op.or]: [{
                    title: {
                        [Op.like]: `%${kword}%`
                    }
                }]
            },
            limit: limit,
            order: [['title', 'ASC']],
            offset: offset,
            include: [
                {model: User, as: 'user'}
            ]
        }),
        Article.count({
            where: {
                [Op.or]: [{
                    title: {
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

    return response.render('articles/all_articles',{
        user: request.user,
        page: 'All articles',
        articles: articles,
        currentPage: (page == undefined ? 0 : Number(page)),
        totalPages: totalPages,
        kword: (kword == undefined ? '' : kword),
        formatDates,
        content
    });
}