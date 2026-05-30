import express from 'express';
import {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getQuizzes)
  .post(protect, createQuiz);

router.route('/:id')
  .get(getQuizById)
  .put(protect, updateQuiz)
  .delete(protect, deleteQuiz);

export default router;
