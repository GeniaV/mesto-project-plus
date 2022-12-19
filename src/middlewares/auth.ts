import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ObjectId } from 'mongoose';
import UnauthorizedError from '../errors/unauthorized_error';

dotenv.config();

const { JWT_SECRET } = process.env;

interface UserPayload {
  _id: ObjectId;
}

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Пользователь не авторизован');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET as string) as UserPayload;
  } catch (err) {
    throw new UnauthorizedError('Пользователь не авторизован');
  }
  req.user = payload;
  return next();
};
