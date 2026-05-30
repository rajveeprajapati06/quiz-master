import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import QuizCard from '../components/QuizCard';
import Spinner from '../components/Spinner';
import { Search, SlidersHorizontal, BookOpen, AlertCircle } from 'lucide-react';

const QuizList = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('latest');

  // List of pre-defined categories
  const categories = ['All', 'Technology', 'Science', 'History', 'General Knowledge', 'Mathematics', 'Literature'];

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const url = `/api/quizzes?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&difficulty=${encodeURIComponent(difficulty)}&sortBy=${sortBy}`;
      const { data } = await axios.get(url);
      setQuizzes(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch quizzes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch quizzes when filters change
    const delayDebounceFn = setTimeout(() => {
      fetchQuizzes();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, difficulty, sortBy]);

  const handleEdit = (quiz) => {
    navigate(`/edit-quiz/${quiz._id}`);
  };

  const handleDelete = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/quizzes/${quizId}`);
        showToast('Quiz deleted successfully', 'success');
        setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to delete quiz', 'error');
      }
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-primary-600" />
          <span>Available Quizzes</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Search, filter, and choose a quiz to test your skill level.
        </p>
      </div>

      {/* Filters Area */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-premium p-6 mb-8 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search bar */}
          <div className="relative w-full lg:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 block w-full py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
            />
          </div>

          {/* Advanced Sliders */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            
            {/* Category Select */}
            <div className="flex-1 sm:flex-initial">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/50 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
              >
                <option disabled>Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Select */}
            <div className="flex-1 sm:flex-initial">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/50 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/50 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
              >
                <option value="latest">Sort by Latest</option>
                <option value="popular">Sort by Popularity</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Cards */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center space-x-2 text-rose-700 mb-8">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Spinner size="lg" />
        </div>
      ) : quizzes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white border border-slate-200 shadow-premium rounded-2xl">
          <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-bold text-lg">No Quizzes Found</p>
          <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
            Try adjusting your search queries or category filters to find matching quizzes.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setDifficulty('All');
              setSortBy('latest');
            }}
            className="mt-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizList;
