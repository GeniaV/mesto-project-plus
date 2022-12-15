import { Router } from 'express';
import {
  getUsers,
  getUsersById,
  updateUser,
  updateAvatar,
  getUser,
} from '../controllers/users';

const router = Router();

router.get('/me', getUser);

router.get('/', getUsers);

router.get('/:userId', getUsersById);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

export default router;
