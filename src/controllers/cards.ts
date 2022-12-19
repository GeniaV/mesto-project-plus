import { Request, Response, NextFunction } from 'express';
import Card from '../models/cards';
import NotFoundError from '../errors/not_found_error';
import BadRequestError from '../errors/bad_request_error';
import ForbiddenError from '../errors/forbidden_error';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
};

export const deleteCardById = (req: Request, res: Response, next: NextFunction) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      }
      if (card && card.owner.toString() === req.user._id.toString()) {
        card.delete();
        res.send({ message: 'Карточка удалена' });
      } next(new ForbiddenError('Недостаточно прав для удаления карточки'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Карточка с указанным _id не найденаа'));
      }
      next(err);
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для проставления лайка'));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      next(err);
    });
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для удаления лайка'));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      next(err);
    });
};
