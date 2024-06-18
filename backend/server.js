import express from 'express';
import dotenv from 'dotenv';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';

import logger from './utils/logger.js';
import connectMongoDB from './db/connectMongoDB.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import addressRoutes from './routes/address.routes.js';
import productCategoryRoutes from './routes/product_category.routes.js';
import productRoutes from './routes/product.routes.js';
import promotionRoutes from './routes/promotion.routes.js';
import orderRoutes from './routes/order.routes.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(pino());
}

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/product-categories', productCategoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/promotions', promotionRoutes);
app.use('/api/v1/orders', orderRoutes);

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  connectMongoDB();
});
