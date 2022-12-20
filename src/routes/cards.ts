import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { validateCardBody, validateCardId, validateLikesCardParams } from '../validators';

const router = Router();

router.get('/', getCards);

router.post('/', validateCardBody, createCard);

router.delete('/:cardId', validateCardId, deleteCardById);

router.put('/:cardId/likes', validateLikesCardParams, likeCard);

router.delete('/:cardId/likes', validateLikesCardParams, dislikeCard);

export default router;
