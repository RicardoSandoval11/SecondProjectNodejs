import sequelize, { Op } from 'sequelize';

import { Category, Videogame, Favorite, Article } from '../models/index.js';
import { formatDates } from '../helpers/formatDate.js';
import { User } from '../models/User.js';

export const homeView = async(request, response) => {

    // categories with more videogames

    const categoriesId = await Videogame.findAll({
        attributes: ['categoryId'],
        group: ['categoryId'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 3
    });

    let categoriesIds = [];

    categoriesId.map(id => categoriesIds.push(id.categoryId));

    // Articles with more favorites
    const articlesId = await Favorite.findAll({
        attributes: ['articleId'],
        group: ['articleId'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 3
    });

    let articleIds = [];

    articlesId.map(id => articleIds.push(id.articleId));

    const [popularCategories, recentArticles, popularArticles] = await Promise.all([
        Category.findAll({
            where: {
                id:{
                    [Op.in]: categoriesIds,
                }
            }
        }),
        Article.findAll({
            limit: 6,
            order: [['createdAt', 'DESC']],
            include: [
                {model: User, as: 'user'}
            ]
        }),
        Article.findAll({
            where: {
                id: {
                    [Op.in]: articleIds
                }
            },
            include: [
                {model: User, as: 'user'}
            ]
        })
    ]);

    return response.render('home/home',{
        page: 'Home',
        user: request.user,
        popularCategories: popularCategories,
        recentArticles: recentArticles,
        popularArticles: popularArticles,
        formatDates: formatDates
    });

}