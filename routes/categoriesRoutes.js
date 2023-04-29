import express from 'express';

import { identifyUser } from '../middlewares/identifyUser.js';
import { allCategories } from '../controllers/categoriesController.js';

const router = express.Router();

router.get('/all', identifyUser, allCategories);

export default router;