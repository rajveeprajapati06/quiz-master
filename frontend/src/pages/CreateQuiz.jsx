import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';
import { Plus, Trash2, ArrowLeft, Save, PlusCircle, AlertCircle } from 'lucide-react';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [difficulty, setDifficulty] = useState('Medium');
  
  // Default with one empty question
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [fetchingQuiz, setFetchingQuiz] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Technology', 'Science', 'History', 'General Knowledge', 'Mathematics', 'Literature'];

  useEffect(() => {
    if (isEditMode) {
      const fetchQuizData = async () => {
        setFetchingQuiz(true);
        try {
          const { data } = await axios.get(`/api/quizzes/${id}`);
          setTitle(data.title);
          setDescription(data.description);
          setCategory(data.category);
          setDifficulty(data.difficulty);
          setQuestions(data.questions);
        } catch (err) {
          console.error(err);
          showToast('Failed to load quiz details', 'error');
          navigate('/dashboard');
        } finally {
          setFetchingQuiz(false);
        }
      };
      fetchQuizData();
    }
  }, [id, isEditMode]);

  // Handle Question Text Change
  const handleQuestionTextChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].questionText = value;
    setQuestions(updated);
  };

  // Handle Option Text Change
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  // Handle Correct Answer Change
  const handleCorrectAnswerChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = parseInt(value, 10);
    setQuestions(updated);
  };

  // Add a new question block
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ]);
  };

  // Remove a question block
  const removeQuestion = (qIndex) => {
    if (questions.length === 1) {
      showToast('A quiz must have at least one question.', 'warning');
      return;
    }
    setQuestions(questions.filter((_, idx) => idx !== qIndex));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Input Validations
    if (!title.trim() || !description.trim()) {
      setError('Please fill in Quiz Title and Description.');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        setError(`Question #${i + 1} details are empty.`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          setError(`Option #${j + 1} of Question #${i + 1} is empty.`);
          return;
        }
      }
    }

    setLoading(true);

    const payload = {
      title,
      description,
      category,
      difficulty,
      questions,
    };

    try {
      if (isEditMode) {
        await axios.put(`/api/quizzes/${id}`, payload);
        showToast('Quiz updated successfully!', 'success');
      } else {
        await axios.post('/api/quizzes', payload);
        showToast('Quiz created successfully!', 'success');
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save quiz. Please try again.');
      showToast(err.response?.data?.message || 'Failed to save quiz', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingQuiz) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {/* Navigation Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-500 hover:text-slate-800 text-sm font-semibold mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back
      </button>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-premium p-6 sm:p-8">
        <div className="border-b border-slate-100 pb-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <PlusCircle className="w-8 h-8 text-primary-600" />
            <span>{isEditMode ? 'Edit Quiz' : 'Create New Quiz'}</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Build your multiple-choice questions. Ensure each question has 4 unique options and select the correct answer.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start space-x-2 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Metadata Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-slate-700 text-sm font-semibold mb-1.5" htmlFor="title">
                Quiz Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Learn Advanced JavaScript"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors text-sm"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 text-sm font-semibold mb-1.5" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                rows="3"
                placeholder="Give details about what the quiz is about, rules, and scoring standard."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-1.5" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-1.5" htmlFor="difficulty">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="block w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Quiz Questions</h2>

            {/* Questions Container */}
            <div className="space-y-6">
              {questions.map((question, qIndex) => (
                <div
                  key={qIndex}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-5 relative animate-[fadeIn_0.2s_ease-out]"
                >
                  {/* Remove Question button */}
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg border border-slate-200 transition-colors"
                      title="Remove Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="mb-4">
                    <span className="text-xs font-extrabold uppercase text-primary-600 tracking-wider">
                      Question #{qIndex + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. What is the output of console.log(typeof NaN)?"
                      value={question.questionText}
                      onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                      className="mt-1.5 block w-full px-4 py-2.5 bg-white rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors text-sm"
                      required
                    />
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex flex-col">
                        <label className="text-slate-600 text-xs font-semibold mb-1">
                          Option {oIndex + 1}
                        </label>
                        <input
                          type="text"
                          placeholder={`Enter choice option #${oIndex + 1}`}
                          value={option}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          className="block w-full px-4 py-2 bg-white rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors text-sm"
                          required
                        />
                      </div>
                    ))}
                  </div>

                  {/* Correct Option Choice */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-700 text-sm font-semibold">Select the Correct Option:</span>
                    <div className="flex flex-wrap items-center gap-4">
                      {question.options.map((_, oIndex) => (
                        <label
                          key={oIndex}
                          className="flex items-center space-x-2 text-sm font-medium text-slate-700 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`correctAnswer-${qIndex}`}
                            value={oIndex}
                            checked={question.correctAnswer === oIndex}
                            onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                            className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-slate-300"
                          />
                          <span>Choice {oIndex + 1}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions for Questions */}
            <div className="mt-5 flex gap-4">
              <button
                type="button"
                onClick={addQuestion}
                className="flex-1 py-3 border-2 border-dashed border-primary-500 hover:bg-primary-50/50 text-primary-600 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Question</span>
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="border-t border-slate-100 pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-md shadow-primary-600/10 hover:shadow-primary-600/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Quiz'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
