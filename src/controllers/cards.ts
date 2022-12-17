import { Request, Response } from 'express';
import Card from '../models/cards';
import NotFoundError from '../errors/not_found_error';
import
{
  BAD_REQUEST_ERROR_STATUS_CODE,
  NOT_FOUND_ERROR_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  FORBIDDEN_ERROR_STATUS_CODE,
} from '../constants';

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'На сервере произошла ошибка' }));

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_STATUS_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

export const deleteCardById = (req: Request, res: Response) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner.toString() === req.user._id.toString()) {
        card.delete();
        return res.send({ message: 'Карточка удалена' });
      } return res.status(FORBIDDEN_ERROR_STATUS_CODE).send({ message: 'Недостаточно прав для удаления карточки' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_STATUS_CODE).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

export const likeCard = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_STATUS_CODE).send({ message: 'Переданы некорректные данные для проставления лайка' });
      }
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_STATUS_CODE).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

export const dislikeCard = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_STATUS_CODE).send({ message: 'Переданы некорректные данные для удаления лайка' });
      }
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_STATUS_CODE).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};
