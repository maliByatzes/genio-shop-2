import express from 'express';
import {
  addProductCategory,
  deleteProductCategory,
  getAllProductCategories,
  updateProductCategory
} from '../controllers/product_category.controllers.js';
import { protectRoute, requireAdmin } from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/new', protectRoute, requireAdmin, addProductCategory)
router.get('/', getAllProductCategories);
router.patch('/update/:id', protectRoute, requireAdmin, updateProductCategory);
router.delete('/delete/:id', protectRoute, requireAdmin, deleteProductCategory);

export default router;
