import express from 'express';

import { 
        allArticles,
        articlesByVideogame,
        createNewArticle, 
        saveArticle,
        myArticles,
        articleDetails,
        updateArticle,
        updateArticleForm,
        deleteArticle } from '../controllers/articlesController.js';
import { protectRoute } from '../middlewares/protectRoute.js';
import upload from '../middlewares/uploadFiles.js';
import { identifyUser } from '../middlewares/identifyUser.js';

const router = express.Router();

router.get('/create', protectRoute ,createNewArticle);
router.post('/save', protectRoute, upload.single('image'), saveArticle);
router.get('/details/:articleId', identifyUser, articleDetails);
router.get('/my-articles', protectRoute, myArticles);
router.post('/update', protectRoute, upload.single('image'), updateArticle);
router.get('/update/:articleId', protectRoute, updateArticleForm);
router.post('/remove/:articleId', protectRoute, deleteArticle);
router.get('/videogame/:videogameId', identifyUser, articlesByVideogame);
router.get('/all', identifyUser, allArticles);

export default router;