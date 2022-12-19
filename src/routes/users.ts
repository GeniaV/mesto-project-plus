import { Router } from 'express';
import {
  getUsers,
  getUsersById,
  updateUser,
  updateAvatar,
  getUser,
} from '../controllers/users';
import { validateUserId, validateUpdateUserBody, validateUpdateUserAvatarBody } from '../validators';

const router = Router();

router.get('/me', getUser);

router.get('/', getUsers);

router.get('/:userId', validateUserId, getUsersById);

router.patch('/me', validateUpdateUserBody, updateUser);

router.patch('/me/avatar', validateUpdateUserAvatarBody, updateAvatar);

export default router;
