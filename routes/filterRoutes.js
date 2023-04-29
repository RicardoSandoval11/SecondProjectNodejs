import express from 'express';

import { identifyUser } from '../middlewares/identifyUser.js';
import { filter } from '../controllers/filterController.js';

const router = express.Router();

router.get('/results', identifyUser, filter);

export default router;