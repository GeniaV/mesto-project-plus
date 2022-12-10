import { Router } from 'express';
import {
  getUsers,
  getUsersById,
  createUser,
  updateUser,
  updateAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);

router.get('/:userId', getUsersById);

router.post('/', createUser);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

export default router;
