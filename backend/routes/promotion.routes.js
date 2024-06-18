import express from 'express';
import { protectRoute, requireAdmin } from '../middleware/protectRoute.js';
import {
  addCategoryToPromotion,
  addPromotion,
  deletePromotion,
  getActivePromotions,
  removeCategoryFromPomotion,
  updatePromotion
} from '../controllers/promotion.controllers.js';

const router = express.Router();

router.post('/new', protectRoute, requireAdmin, addPromotion);
router.post('/category/new/:id', protectRoute, requireAdmin, addCategoryToPromotion);
router.delete('/category/delete/:id', protectRoute, requireAdmin, removeCategoryFromPomotion);
router.get('/', getActivePromotions);
router.patch('/update/:id', protectRoute, requireAdmin, updatePromotion);
router.delete('/delete/:id', protectRoute, requireAdmin, deletePromotion);

export default router;
