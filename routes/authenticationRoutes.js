import express from 'express';

import { ActivateAccountForm,
        ActivateAccount,
        CreateAccount,
        Login,
        LoginForm,
        Logout,
        RecoverPasswordForm,
        RecoverPassword,
        RegisterForm,
        UpdatePasswordForm,
        UpdatePassword} from '../controllers/authenticationController.js';
import { blockAuthUsers } from '../middlewares/blockAuthUsers.js';
import upload from '../middlewares/uploadFiles.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.get('/register', blockAuthUsers, RegisterForm);
router.post('/register', upload.single('profileImage'), blockAuthUsers, CreateAccount);
router.get('/login', blockAuthUsers, LoginForm);
router.post('/login', blockAuthUsers, Login);
router.get('/activate-account/:token', blockAuthUsers, ActivateAccountForm);
router.post('/activate-account', blockAuthUsers, ActivateAccount);
router.get('/recover-password', blockAuthUsers, RecoverPasswordForm);
router.post('/recover-password', blockAuthUsers, RecoverPassword);
router.get('/update-password/:token', blockAuthUsers, UpdatePasswordForm);
router.post('/update-password', blockAuthUsers, UpdatePassword);
router.get('/logout', protectRoute, Logout);

export default router;


