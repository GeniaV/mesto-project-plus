import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/users';
import NotFoundError from '../errors/not_found_error';
import BadRequestError from '../errors/bad_request_error';
import ConflictError from '../errors/conflict_error';
import { EXPIRED_TOKEN_MS } from '../constants';

dotenv.config();

const { JWT_SECRET } = process.env;

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const getUsersById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      next(err);
    });
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      next(err);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
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
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      next(err);
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  User.findUserAndUpdateById(req.user._id, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      next(err);
    });
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  User.findUserAndUpdateById(req.user._id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для обновления аватара'));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      next(err);
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
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
    .catch(next);
};
