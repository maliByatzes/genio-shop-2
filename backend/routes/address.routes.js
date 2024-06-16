import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { addAddress, deleteAddress, getAddresses, updateAddress } from '../controllers/address.controllers.js';

const router = express.Router();

router.post('/new', protectRoute, addAddress);
router.get('/all', protectRoute, getAddresses);
router.patch('/update/:id', protectRoute, updateAddress);
router.delete('/delete/:id', protectRoute, deleteAddress);

export default router;
