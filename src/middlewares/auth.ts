import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ObjectId } from 'mongoose';
import { UNAUTHORIZED_ERROR_STATUS_CODE } from '../constants';

dotenv.config();

const { JWT_SECRET } = process.env;

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED_ERROR_STATUS_CODE).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET as string);
  } catch (err) {
    return res.status(UNAUTHORIZED_ERROR_STATUS_CODE).send({ message: 'Необходима авторизация' });
  }
  req.user = { _id: payload as ObjectId };
  return next();
};
