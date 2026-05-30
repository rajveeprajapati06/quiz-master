import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import QuizCard from '../components/QuizCard';
import Spinner from '../components/Spinner';
import { User, History, PlusCircle, Award, Calendar, ChevronRight, BarChart3, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [stats, setStats] = useState({ totalCreated: 0, totalTaken: 0, highestScore: 0 });

  // Sidebar navigation options
  const dashboardTabs = [
    { id: 'profile', name: 'My Profile', icon: User },
    { id: 'quizzes', name: 'My Created Quizzes', icon: PlusCircle },
    { id: 'attempts', name: 'Quiz Attempts History', icon: History },
  ];

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Refresh profile and obtain updated stats
      const profileData = await refreshProfile();
      if (profileData && profileData.stats) {
        setStats({
          totalCreated: profileData.stats.totalQuizzesCreated,
          totalTaken: profileData.stats.totalQuizzesTaken,
          highestScore: profileData.stats.highestScore,
        });
      }

      // 2. Fetch all quizzes and filter down to user's quizzes
      const quizzesRes = await axios.get('/api/quizzes');
      const myQuizzes = quizzesRes.data.filter(
        (quiz) => quiz.creator?._id === user?._id || quiz.creator === user?._id
      );
      setCreatedQuizzes(myQuizzes);

      // 3. Fetch user attempts history
      const attemptsRes = await axios.get('/api/attempts/user');
      setAttempts(attemptsRes.data);
    } catch (err) {
      console.error(err);
      showToast('Error loading dashboard information', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleEdit = (quiz) => {
    navigate(`/edit-quiz/${quiz._id}`);
  };

  const handleDelete = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/quizzes/${quizId}`);
        showToast('Quiz deleted successfully', 'success');
        setCreatedQuizzes((prev) => prev.filter((q) => q._id !== quizId));
        // Refresh stats
        setStats((prev) => ({ ...prev, totalCreated: prev.totalCreated - 1 }));
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to delete quiz', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} tabs={dashboardTabs} />

      {/* Main Content Area */}
      <div className="flex-1 space-y-8 min-w-0">
        
        {/* Statistics Panels at top */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-premium flex items-center space-x-4">
            <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-800 leading-tight">{stats.totalCreated}</p>
              <p className="text-slate-500 text-xs font-semibold uppercase">Quizzes Created</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-premium flex items-center space-x-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
              <History className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-800 leading-tight">{stats.totalTaken}</p>
              <p className="text-slate-500 text-xs font-semibold uppercase">Attempts Completed</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-premium flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-800 leading-tight">{stats.highestScore}%</p>
              <p className="text-slate-500 text-xs font-semibold uppercase">Best Score</p>
            </div>
          </div>
        </section>

        {/* Tab Content Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-premium p-6 sm:p-8">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="animate-[fadeIn_0.2s_ease-out]">
              <h3 className="text-lg font-bold text-slate-800 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" />
                <span>Profile Information</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="block text-slate-400 text-xs font-semibold uppercase">Full Name</span>
                  <span className="text-slate-800 text-base font-semibold mt-1 block">{user?.name}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-xs font-semibold uppercase">Email Address</span>
                  <span className="text-slate-800 text-base font-semibold mt-1 block">{user?.email}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-xs font-semibold uppercase">Role</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 uppercase mt-1">
                    {user?.role}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400 text-xs font-semibold uppercase">Registered On</span>
                  <span className="text-slate-800 text-base font-semibold mt-1 block">
                    {new Date(user?.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* CREATED QUIZZES TAB */}
          {activeTab === 'quizzes' && (
            <div className="animate-[fadeIn_0.2s_ease-out]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-3 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-primary-600" />
                  <span>My Created Quizzes</span>
                </h3>
                <Link
                  to="/create-quiz"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1 shadow-md shadow-primary-600/10 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Quiz</span>
                </Link>
              </div>

              {createdQuizzes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {createdQuizzes.map((quiz) => (
                    <QuizCard
                      key={quiz._id}
                      quiz={quiz}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <PlusCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-bold text-sm">No Quizzes Created</p>
                  <p className="text-slate-400 text-xs mt-1">Design and publish your own quiz custom questions.</p>
                  <Link
                    to="/create-quiz"
                    className="inline-flex mt-4 bg-primary-600 text-white font-bold text-xs px-4 py-2 rounded-lg"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ATTEMPTS HISTORY TAB */}
          {activeTab === 'attempts' && (
            <div className="animate-[fadeIn_0.2s_ease-out]">
              <h3 className="text-lg font-bold text-slate-800 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
                <History className="w-5 h-5 text-primary-600" />
                <span>Quiz Attempts History</span>
              </h3>

              {attempts.length > 0 ? (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead>
                      <tr className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50/50">
                        <th className="py-3 px-4 rounded-l-lg">Quiz Title</th>
                        <th className="py-3 px-4">Score</th>
                        <th className="py-3 px-4">Percentage</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date Taken</th>
                        <th className="py-3 px-4 rounded-r-lg">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {attempts.map((attempt) => (
                        <tr key={attempt._id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-800 truncate max-w-[200px]" title={attempt.quiz?.title}>
                            {attempt.quiz?.title || 'Deleted Quiz'}
                          </td>
                          <td className="py-3.5 px-4">
                            {attempt.score} / {attempt.quiz?.questions?.length || attempt.answers?.length || 0}
                          </td>
                          <td className="py-3.5 px-4 font-bold">{attempt.percentage}%</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border ${
                                attempt.passed
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                  : 'bg-rose-50 text-rose-700 border-rose-100'
                              }`}
                            >
                              {attempt.passed ? 'Pass' : 'Fail'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-xs">
                            {new Date(attempt.submittedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3.5 px-4">
                            <Link
                              to={`/results/${attempt._id}`}
                              className="text-primary-600 hover:text-primary-700 font-bold text-xs flex items-center space-x-0.5"
                            >
                              <span>Review</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-bold text-sm">No Attempts Recorded</p>
                  <p className="text-slate-400 text-xs mt-1">Challenge yourself! Go and test your skills.</p>
                  <Link
                    to="/quizzes"
                    className="inline-flex mt-4 bg-primary-600 text-white font-bold text-xs px-4 py-2 rounded-lg"
                  >
                    Take a Quiz
                  </Link>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
