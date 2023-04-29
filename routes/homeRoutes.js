import express from 'express';

import { homeView } from '../controllers/homeController.js';
import { identifyUser } from '../middlewares/identifyUser.js';

const router = express.Router();

router.get('/', identifyUser, homeView);

export default router;