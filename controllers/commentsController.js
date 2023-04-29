import { check, validationResult } from 'express-validator';

import { Comment, Article } from '../models/index.js';
import { formatDates } from '../helpers/formatDate.js';

export const createComment = async(request, response) => {

    try {
        await check('content').notEmpty().withMessage('Comments cannot be empty').run(request);
    
        const { content, articleId } = request.body;
    
        let result = validationResult(request);
    
        if(!result.isEmpty()){
    
            const article = await Article.findByPk(articleId);

            const comments = await Comment.findAll({
                where:{
                    articleId: articleId
                }
            });
    
            return response.render('articles/article_details',{
                page: article.title,
                user: request.user,
                article: article,
                formatDates: formatDates,
                csrfToken: request.csrfToken(),
                error: true,
                comments:comments
            });
        }
    
        // create comment
        const newComment = new Comment();
    
        newComment.content = content;
        newComment.articleId = Number(articleId);
        newComment.userId = request.user.id;
    
        await newComment.save();
    
        return response.redirect(`/articles/details/${articleId}`);
        
    } catch (error) {
        console.log(error);
    }

}

export const deleteComment = async(request, response) => {

    try {
        
        const { commentId, articleId } = request.body;

        // verify who is the owner
        const comment = await Comment.findByPk(commentId);

        if(comment.userId.toString() != request.user.id.toString()){
            return response.redirect(`/articles/details/${articleId}`);
        }

        // remove comment
        await comment.destroy();

        return response.redirect(`/articles/details/${articleId}`);

    } catch (error) {
        console.log(error);
    }

}
