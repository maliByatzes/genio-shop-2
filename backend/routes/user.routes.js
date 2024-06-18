import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getUser, updateUser, addItemToCart, removeItemFromCart } from '../controllers/user.controllers.js';

const router = express.Router();

router.get('/', protectRoute, getUser);
router.patch('/', protectRoute, updateUser);
router.post('/add-to-cart', protectRoute, addItemToCart);
router.post('/remove-from-cart', protectRoute, removeItemFromCart);

export default router;
