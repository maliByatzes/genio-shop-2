import express from 'express';
import { protectRoute, requireAdmin } from '../middleware/protectRoute.js';
import {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
} from '../controllers/product.controllers.js';

const router = express.Router();

router.post('/new', protectRoute, requireAdmin, addProduct);
router.get('/', getAllProducts);
router.patch('/update/:id', protectRoute, requireAdmin, updateProduct);
router.delete('/delete/:id', protectRoute, requireAdmin, deleteProduct);

export default router;
