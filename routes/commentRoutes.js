import express from 'express';

import { 
        createComment,
        deleteComment } from '../controllers/commentsController.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.post('/new', protectRoute, createComment);
router.post('/delete', protectRoute, deleteComment);

export default router;

