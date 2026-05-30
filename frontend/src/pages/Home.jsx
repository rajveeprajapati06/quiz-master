import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import QuizCard from '../components/QuizCard';
import Spinner from '../components/Spinner';
import { ArrowRight, HelpCircle, Trophy, Users, BookOpen, Star } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredQuizzes, setFeaturedQuizzes] = useState([]);
  const [stats, setStats] = useState({ quizzes: 0, attempts: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch popular quizzes for Featured Quizzes
        const quizzesRes = await axios.get('/api/quizzes?sortBy=popular');
        setFeaturedQuizzes(quizzesRes.data.slice(0, 3));

        // Fetch statistics (we can call public stats or mock it if server is just starting)
        try {
          const statsRes = await axios.get('/api/attempts/stats');
          setStats({
            quizzes: statsRes.data.totalQuizzes || 0,
            attempts: statsRes.data.totalAttempts || 0,
            users: statsRes.data.totalUsers || 0,
          });
        } catch (e) {
          // If not admin and cannot access stats, calculate from list or fallback to seed data sizes
          setStats({
            quizzes: quizzesRes.data.length,
            attempts: quizzesRes.data.reduce((acc, q) => acc + (q.attemptsCount || 0), 0),
            users: 2, // Mock fallback
          });
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col justify-start">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-indigo-950">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        {/* Decorative ambient lights */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          {user && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-6">
              Welcome back, {user.name}! 👋
            </span>
          )}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
            Create, Share, and Master <br />
            Any Subject with Interactive Quizzes
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-base sm:text-xl mb-10 leading-relaxed font-sans">
            QuizMaster is the ultimate platform for educators, students, and trivia enthusiasts. Design custom multiple-choice quizzes or test your skills on featured topics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/quizzes"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary-600/20 transition-all duration-200"
            >
              <span>Explore Quizzes</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to={user ? '/create-quiz' : '/login'}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold px-8 py-4 rounded-xl transition-all duration-200"
            >
              <span>Create Your Own</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 -mt-10 w-full mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-premium flex items-center space-x-4">
            <div className="p-3.5 bg-primary-50 rounded-xl text-primary-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 tracking-tight">{stats.quizzes}</p>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Quizzes</p>
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-premium flex items-center space-x-4">
            <div className="p-3.5 bg-amber-50 rounded-xl text-amber-500">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 tracking-tight">{stats.attempts}</p>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Quiz Attempts</p>
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-premium flex items-center space-x-4">
            <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 tracking-tight">{stats.users}</p>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Learners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Quizzes Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-20 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-400 fill-current" />
              <span>Featured Quizzes</span>
            </h2>
            <p className="text-slate-500 text-sm mt-1">Check out the most taken quizzes on QuizMaster</p>
          </div>
          <Link
            to="/quizzes"
            className="mt-4 sm:mt-0 text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center space-x-1"
          >
            <span>See All Quizzes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : featuredQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredQuizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-2xl">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">No quizzes available yet.</p>
            <p className="text-slate-400 text-xs mt-1">Be the first to create one!</p>
            <Link
              to="/create-quiz"
              className="inline-flex mt-4 bg-primary-600 text-white font-semibold text-sm px-4 py-2 rounded-lg"
            >
              Create a Quiz
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
