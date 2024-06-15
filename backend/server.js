import express from 'express';
import dotenv from 'dotenv';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import logger from './utils/logger.js';
import connectMongoDB from './db/connectMongoDB.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(pino());
}

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  connectMongoDB();
});
