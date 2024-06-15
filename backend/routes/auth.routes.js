import express from 'express';
import { loginHandler, logoutHandler, registerHandler } from '../controllers/auth.controllers.js';

const router = express.Router();

router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.post('/logout', logoutHandler);

export default router;
