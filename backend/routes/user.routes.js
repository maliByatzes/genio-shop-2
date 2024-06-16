import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getUser, updateUser } from '../controllers/user.controllers.js';

const router = express.Router();

router.get('/', protectRoute, getUser);
router.patch('/', protectRoute, updateUser);

export default router;
