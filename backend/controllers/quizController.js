import Quiz from '../models/Quiz.js';

// @desc    Get all quizzes with filters, search and sorting
// @route   GET /api/quizzes
// @access  Public
export const getQuizzes = async (req, res) => {
  const { search, category, difficulty, sortBy } = req.query;

  try {
    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Difficulty filter
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    let apiQuery = Quiz.find(query).populate('creator', 'name');

    // Sorting
    if (sortBy === 'popular') {
      apiQuery = apiQuery.sort({ attemptsCount: -1, createdAt: -1 });
    } else {
      // Default: latest
      apiQuery = apiQuery.sort({ createdAt: -1 });
    }

    const quizzes = await apiQuery;
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quiz by ID
// @route   GET /api/quizzes/:id
// @access  Public
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('creator', 'name');

    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private
export const createQuiz = async (req, res) => {
  const { title, description, category, difficulty, questions } = req.body;

  if (!questions || questions.length === 0) {
    return res.status(400).json({ message: 'A quiz must have at least one question.' });
  }

  try {
    const quiz = new Quiz({
      title,
      description,
      category,
      difficulty,
      creator: req.user._id,
      questions,
    });

    const createdQuiz = await quiz.save();
    res.status(201).json(createdQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an existing quiz
// @route   PUT /api/quizzes/:id
// @access  Private
export const updateQuiz = async (req, res) => {
  const { title, description, category, difficulty, questions } = req.body;

  try {
    const quiz = await Quiz.findById(req.params.id);

    if (quiz) {
      // Check if creator is the user or user is admin
      if (quiz.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to edit this quiz' });
      }

      quiz.title = title || quiz.title;
      quiz.description = description || quiz.description;
      quiz.category = category || quiz.category;
      quiz.difficulty = difficulty || quiz.difficulty;
      if (questions) {
        quiz.questions = questions;
      }

      const updatedQuiz = await quiz.save();
      res.json(updatedQuiz);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (quiz) {
      // Check if creator is the user or user is admin
      if (quiz.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this quiz' });
      }

      await Quiz.deleteOne({ _id: req.params.id });
      res.json({ message: 'Quiz deleted successfully' });
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
