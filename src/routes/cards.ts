import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { validateCardBody, validateCardId, validateLikesCardBody } from '../validators';

const router = Router();

router.get('/', getCards);

router.post('/', validateCardBody, createCard);

router.delete('/:cardId', validateCardId, deleteCardById);

router.put('/:cardId/likes', validateLikesCardBody, likeCard);

router.delete('/:cardId/likes', validateLikesCardBody, dislikeCard);

export default router;
