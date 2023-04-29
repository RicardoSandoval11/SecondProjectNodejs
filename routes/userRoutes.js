import express from 'express';

import upload from '../middlewares/uploadFiles.js';
import { myAccount, updateUserInformation, updateInformation } from '../controllers/userController.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.get('/dashboard', protectRoute, myAccount);
router.get('/update', protectRoute, updateUserInformation);
router.post('/update', protectRoute, upload.single('photo'), updateInformation);

export default router;