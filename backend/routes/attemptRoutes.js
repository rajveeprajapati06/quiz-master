import express from 'express';
import {
  createAttempt,
  getUserAttempts,
  getPlatformStats,
  getAttemptById,
} from '../controllers/attemptController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createAttempt);
router.get('/user', protect, getUserAttempts);
router.get('/stats', protect, admin, getPlatformStats);
router.get('/:id', protect, getAttemptById);

export default router;
