import express from 'express';
import {allVideogames, 
        createVideogameForm,
        myVideogames,
        removeVideogame,
        update,
        updateVideogame,
        saveVideogame,
        videogamesByCategory } from '../controllers/videogameController.js';
import { protectRoute } from '../middlewares/protectRoute.js';
import upload from '../middlewares/uploadFiles.js';
import { identifyUser } from '../middlewares/identifyUser.js';

const router = express.Router();

router.get('/all', identifyUser, allVideogames);
router.get('/create', protectRoute, createVideogameForm);
router.post('/create', protectRoute, upload.single('image'), saveVideogame);
router.get('/my-videogames', protectRoute, myVideogames);
router.get('/category/:categoryId', identifyUser, videogamesByCategory);
router.post('/remove', protectRoute, removeVideogame);
router.get('/edit', protectRoute, updateVideogame);
router.post('/update', protectRoute, upload.single('image'), update);

export default router;

