import { Router } from 'express';
import { getUsers, getUsersById, createUser } from '../controllers/users';

const router = Router();

router.get('/', getUsers);

router.get('/:userId', getUsersById);

router.post('/', createUser);

export default router;
