import express from 'express';
import { loginHandler, logoutHandler, registerAdminHandler, registerHandler } from '../controllers/auth.controllers.js';

const router = express.Router();

router.post('/register', registerHandler);
router.post('/admin/register', registerAdminHandler);
router.post('/login', loginHandler);
router.post('/logout', logoutHandler);

export default router;
