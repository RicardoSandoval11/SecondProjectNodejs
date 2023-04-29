import express from 'express';

import { protectRoute } from '../middlewares/protectRoute.js';
import { addFavorite, myFavorites, removeFavorite } from '../controllers/favoriteController.js';

const router = express.Router()

router.post('/add', protectRoute, addFavorite);
router.get('/my-favorites', protectRoute, myFavorites);
router.post('/remove', protectRoute, removeFavorite);

export default router;