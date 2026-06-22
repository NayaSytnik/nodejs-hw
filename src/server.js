import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import userRoutes from './routes/userRoutes.js';


import userRouter from './routes/userRoutes.js';
import { connectMongoDB } from './db/connectMongoDB.js';

import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(logger);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(userRoutes);
app.use(authRouter);
app.use(notesRouter);
app.use(userRouter);
app.use(errors());
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectMongoDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Mongo connection error:', err);
    process.exit(1);
  }
}

startServer();
