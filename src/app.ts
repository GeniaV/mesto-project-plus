import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/errors';

dotenv.config();

const { PORT, DB_CONN } = process.env;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

mongoose.connect(`${DB_CONN}`);

app.use(requestLogger);

app.post('/signin', login);

app.post('/signup', createUser);

app.use(auth);

app.use('/users', userRouter);

app.use('/cards', cardRouter);

app.use(errorLogger);

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(errorHandler);

app.listen(PORT);
