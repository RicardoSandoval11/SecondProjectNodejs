import { Op } from 'sequelize';

import { Category } from '../models/Category.js';

export const allCategories = async(request, response) => {

    const { kword, page } = request.query;

    const limit = 6;
    const offset = limit*(page == undefined ? 0 : page);

    if(kword == undefined){
        const [categories, total] = await Promise.all([
            Category.findAll({
                limit: limit,
                offset: offset,
                order: [['title', 'ASC']]
            }),
            Category.count()
        ]);

        const totalPages = Math.ceil(total/limit);

        let content = true;

        if(total == 0){
            content = false;
        }

        return response.render('categories/all_categories',{
            user: request.user,
            page: 'All categories',
            categories: categories,
            currentPage: (page == undefined ? 0 : Number(page)),
            totalPages: totalPages,
            kword: '',
            content
        });
    }

    const [categories, total] = await Promise.all([
        Category.findAll({
            where: {
                [Op.or]: [{
                    title: {
                        [Op.like]: `%${kword}%`
                    }
                }]
            },
            limit: limit,
            order: [['title', 'ASC']],
            offset: offset
        }),
        Category.count({
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

    return response.render('categories/all_categories',{
        user: request.user,
        page: 'All categories',
        categories: categories,
        currentPage: (page == undefined ? 0 : Number(page)),
        totalPages: totalPages,
        kword: (kword == undefined ? '' : kword),
        content
    });
}