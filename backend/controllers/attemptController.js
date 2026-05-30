import Attempt from '../models/Attempt.js';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

// @desc    Submit answers and record a quiz attempt
// @route   POST /api/attempts
// @access  Private
export const createAttempt = async (req, res) => {
  const { quizId, answers } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!answers || !Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ message: 'Invalid or incomplete answers provided.' });
    }

    let score = 0;
    const questionsCount = quiz.questions.length;

    // Evaluate answers
    const resultsSummary = quiz.questions.map((question, index) => {
      const chosenAnswer = answers[index];
      const correctAnswer = question.correctAnswer;
      const isCorrect = chosenAnswer === correctAnswer;

      if (isCorrect) {
        score += 1;
      }

      return {
        questionText: question.questionText,
        options: question.options,
        chosenAnswer,
        correctAnswer,
        isCorrect,
      };
    });

    const percentage = Math.round((score / questionsCount) * 100);
    const passed = percentage >= 60; // 60% passing threshold

    const attempt = new Attempt({
      user: req.user._id,
      quiz: quizId,
      answers,
      score,
      percentage,
      passed,
    });

    const createdAttempt = await attempt.save();

    // Increment attemptsCount on the quiz
    quiz.attemptsCount += 1;
    await quiz.save();

    res.status(201).json({
      attempt: createdAttempt,
      resultsSummary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's quiz attempts
// @route   GET /api/attempts/user
// @access  Private
export const getUserAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.user._id })
      .populate({
        path: 'quiz',
        select: 'title category difficulty questions creator',
        populate: { path: 'creator', select: 'name' }
      })
      .sort({ submittedAt: -1 });

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin statistics and reports
// @route   GET /api/attempts/stats
// @access  Private/Admin
export const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalQuizzes = await Quiz.countDocuments({});
    const totalAttempts = await Attempt.countDocuments({});

    // Calculate pass rate
    const passedAttempts = await Attempt.countDocuments({ passed: true });
    const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;

    // Get quizzes category breakdown
    const categoryStats = await Quiz.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Get last 5 attempts
    const recentAttempts = await Attempt.find({})
      .populate('user', 'name email')
      .populate('quiz', 'title category')
      .sort({ submittedAt: -1 })
      .limit(5);

    // Get top 5 quizzes
    const popularQuizzes = await Quiz.find({})
      .populate('creator', 'name')
      .sort({ attemptsCount: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalQuizzes,
      totalAttempts,
      passRate,
      categoryStats,
      recentAttempts,
      popularQuizzes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attempt by ID
// @route   GET /api/attempts/:id
// @access  Private
export const getAttemptById = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
      .populate('quiz')
      .populate('user', 'name');

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    // Verify it is the user's attempt or the user is admin
    if (attempt.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this attempt' });
    }

    // Generate resultsSummary dynamically for review
    const resultsSummary = attempt.quiz.questions.map((question, index) => {
      const chosenAnswer = attempt.answers[index];
      const correctAnswer = question.correctAnswer;
      const isCorrect = chosenAnswer === correctAnswer;

      return {
        questionText: question.questionText,
        options: question.options,
        chosenAnswer,
        correctAnswer,
        isCorrect,
      };
    });

    res.json({
      attempt,
      resultsSummary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

