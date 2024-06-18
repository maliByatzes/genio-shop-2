import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createOrder } from '../controllers/order.controllers.js';

const router = express.Router();

router.post('/create', protectRoute, createOrder);

export default router;
