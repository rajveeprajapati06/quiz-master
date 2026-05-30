import express from 'express';
import {
  registerUser,
  authUser,
  getUserProfile,
  getUsers,
  deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);

export default router;
