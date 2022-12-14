import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/users';
import NotFoundError from '../errors/not_found_error';
import {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE_ERROR,
  INTERNAL_SERVER_STATUS_CODE,
  EXPIRED_TOKEN_MS,
} from '../constants';

dotenv.config();

const { JWT_SECRET } = process.env;

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(INTERNAL_SERVER_STATUS_CODE).send({ message: 'На сервере произошла ошибка' }));

export const getUsersById = (req: Request, res: Response) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_STATUS_CODE_ERROR).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(INTERNAL_SERVER_STATUS_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

export const createUser = (req: Request, res: Response) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name,
        about,
        avatar,
        email,
        password: hash,
      },
    ))
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(INTERNAL_SERVER_STATUS_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

export const updateUser = (req: Request, res: Response) => {
  const { name, about } = req.body;
  User.findUserAndUpdateById(req.user._id, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_STATUS_CODE_ERROR).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(INTERNAL_SERVER_STATUS_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

export const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;
  User.findUserAndUpdateById(req.user._id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Переданы некорректные данные для обновления аватара' });
      }
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_STATUS_CODE_ERROR).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(INTERNAL_SERVER_STATUS_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      if (JWT_SECRET) {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('jwt', token, {
          maxAge: EXPIRED_TOKEN_MS,
          httpOnly: true,
          sameSite: true,
        });
        res.send({ token });
      }
    })
    .catch(() => res.status(INTERNAL_SERVER_STATUS_CODE).send({ message: 'На сервере произошла ошибка' }));
};
