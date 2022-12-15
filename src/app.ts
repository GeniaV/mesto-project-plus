import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { login, createUser } from './controllers/users';

dotenv.config();

const { PORT, DB_CONN } = process.env;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

mongoose.connect(`${DB_CONN}`);

app.use((req, res, next) => {
  req.user = {
    _id: '639245a72c728e8fb4030bfb',
  };
  next();
});

app.use('/users', userRouter);

app.use('/cards', cardRouter);

app.post('/signin', login);

app.post('/signup', createUser);

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.listen(PORT);
