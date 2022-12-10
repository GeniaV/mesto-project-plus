import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '639245a72c728e8fb4030bfb',
  };
  next();
});

app.use('/users', userRouter);

app.use('/cards', cardRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {

});
