import { Op } from 'sequelize';

import { Category } from '../models/Category.js';
import { Article, Videogame } from '../models/index.js';

export const filter = async(request, response) => {

    const { kwordh } = request.query;

    if( kwordh == undefined ){
        return response.redirect('');
    }

    // filter all
    const [categories, videogames, articles] = await Promise.all([
        Category.findAll({
            where: {
                [Op.or]:[{
                    title: {
                        [Op.like]:`%${kwordh}%`
                    },
                    description: {
                        [Op.like]: `%${kwordh}%`
                    }
                    }
                ]
            },
            order: [['createdAt', 'DESC']],
            limit: 8
        }),
        Videogame.findAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]:`%${kwordh}%`
                        },
                        description: {
                            [Op.like]: `%${kwordh}%`
                        }
                    }
                ]
            },
            order: [['createdAt', 'DESC']],
            limit: 4
        }),
        Article.findAll({
            where: {
                [Op.or]: [
                    {
                        title: {
                            [Op.like]: `%${kwordh}%`
                        },
                        content: {
                            [Op.like]: `%${kwordh}%`
                        }
                    }
                ]
            },
            order: [['createdAt', 'DESC']],
            limit: 4
        })
    ]);

    let isCategories = true;
    let isArticles = true;
    let isVideogames = true;

    if(articles.length == 0){
        isArticles = false;
    }

    if(categories.length == 0){
        isCategories = false;
    }

    if(videogames.length == 0){
        isVideogames = false;
    }

    return response.render('filter/all',{
        page: 'All Results',
        user: request.user,
        kword: kwordh,
        articles: articles,
        categories: categories,
        videogames: videogames,
        isArticles,
        isCategories,
        isVideogames
    });
}