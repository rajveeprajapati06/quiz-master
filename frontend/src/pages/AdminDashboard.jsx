import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import Spinner from '../components/Spinner';
import { BarChart3, Users, BookOpen, AlertCircle, ShieldAlert, Trash2, Award } from 'lucide-react';

const AdminDashboard = () => {
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // States
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  // Sidebar navigation options for admin
  const adminTabs = [
    { id: 'overview', name: 'Platform Overview', icon: BarChart3 },
    { id: 'users', name: 'Manage Users', icon: Users },
    { id: 'quizzes', name: 'Manage Quizzes', icon: BookOpen },
  ];

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch platform statistics
      const statsRes = await axios.get('/api/attempts/stats');
      setStats(statsRes.data);

      // 2. Fetch users list
      const usersRes = await axios.get('/api/users');
      setUsers(usersRes.data);

      // 3. Fetch quizzes list
      const quizzesRes = await axios.get('/api/quizzes');
      setQuizzes(quizzesRes.data);

    } catch (err) {
      console.error(err);
      showToast('Error loading administrative data. Access denied.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This will remove all their data.')) {
      try {
        await axios.delete(`/api/users/${userId}`);
        showToast('User deleted successfully', 'success');
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        
        // Decrement users count in stats
        setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to delete user', 'error');
      }
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz? This action is permanent.')) {
      try {
        await axios.delete(`/api/quizzes/${quizId}`);
        showToast('Quiz deleted successfully', 'success');
        setQuizzes((prev) => prev.filter((q) => q._id !== quizId));

        // Decrement quizzes count in stats
        setStats((prev) => ({ ...prev, totalQuizzes: prev.totalQuizzes - 1 }));
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} tabs={adminTabs} isAdmin={true} />

      {/* Main Content Area */}
      <div className="flex-1 space-y-8 min-w-0">
        
        {/* Statistics Panels at top */}
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-premium flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-800 leading-tight">{stats?.totalUsers || 0}</p>
              <p className="text-slate-500 text-xs font-semibold uppercase">Total Users</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-premium flex items-center space-x-4">
            <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-800 leading-tight">{stats?.totalQuizzes || 0}</p>
              <p className="text-slate-500 text-xs font-semibold uppercase">Quizzes Online</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-premium flex items-center space-x-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-800 leading-tight">{stats?.totalAttempts || 0}</p>
              <p className="text-slate-500 text-xs font-semibold uppercase">Attempts taken</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-premium flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-800 leading-tight">{stats?.passRate || 0}%</p>
              <p className="text-slate-500 text-xs font-semibold uppercase">Pass Rate</p>
            </div>
          </div>
        </section>

        {/* Tab Content Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-premium p-6 sm:p-8">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="animate-[fadeIn_0.2s_ease-out] space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-500" />
                  <span>Platform Administrative Overview</span>
                </h3>

                {/* Popular Quizzes Grid */}
                <h4 className="font-bold text-slate-700 text-sm mb-4">Most Popular Quizzes</h4>
                <div className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-xl">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead>
                      <tr className="text-left text-slate-400 text-xs font-bold uppercase bg-slate-50">
                        <th className="py-2.5 px-4">Title</th>
                        <th className="py-2.5 px-4">Category</th>
                        <th className="py-2.5 px-4">Difficulty</th>
                        <th className="py-2.5 px-4">Creator</th>
                        <th className="py-2.5 px-4">Attempts Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {stats?.popularQuizzes?.map((q) => (
                        <tr key={q._id}>
                          <td className="py-3 px-4 font-bold text-slate-800 truncate max-w-[180px]">{q.title}</td>
                          <td className="py-3 px-4 text-xs font-semibold">{q.category}</td>
                          <td className="py-3 px-4 text-xs">{q.difficulty}</td>
                          <td className="py-3 px-4 text-slate-500 text-xs">{q.creator?.name || 'Anonymous'}</td>
                          <td className="py-3 px-4 font-bold text-primary-600">{q.attemptsCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent attempts review */}
              <div>
                <h4 className="font-bold text-slate-700 text-sm mb-4">Recent Quiz Activity</h4>
                <div className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-xl">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead>
                      <tr className="text-left text-slate-400 text-xs font-bold uppercase bg-slate-50">
                        <th className="py-2.5 px-4">User</th>
                        <th className="py-2.5 px-4">Quiz Title</th>
                        <th className="py-2.5 px-4">Score</th>
                        <th className="py-2.5 px-4">Percentage</th>
                        <th className="py-2.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {stats?.recentAttempts?.map((att) => (
                        <tr key={att._id}>
                          <td className="py-3 px-4 font-bold text-slate-800 truncate max-w-[150px]">
                            {att.user?.name || 'Deleted User'}
                          </td>
                          <td className="py-3 px-4 text-slate-600 truncate max-w-[150px]" title={att.quiz?.title}>
                            {att.quiz?.title || 'Deleted Quiz'}
                          </td>
                          <td className="py-3 px-4">{att.score}</td>
                          <td className="py-3 px-4 font-bold">{att.percentage}%</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                                att.passed ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'
                              }`}
                            >
                              {att.passed ? 'Pass' : 'Fail'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="animate-[fadeIn_0.2s_ease-out]">
              <h3 className="text-lg font-bold text-slate-800 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-600" />
                <span>Registered Platform Users</span>
              </h3>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead>
                    <tr className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50">
                      <th className="py-3 px-4 rounded-l-lg">User Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Registered Date</th>
                      <th className="py-3 px-4 rounded-r-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-bold text-slate-800">{u.name}</td>
                        <td className="py-3 px-4 font-mono text-xs">{u.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase border ${
                              u.role === 'admin'
                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            disabled={u.role === 'admin'}
                            className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* QUIZZES TAB */}
          {activeTab === 'quizzes' && (
            <div className="animate-[fadeIn_0.2s_ease-out]">
              <h3 className="text-lg font-bold text-slate-800 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-600" />
                <span>All Published Quizzes</span>
              </h3>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead>
                    <tr className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50">
                      <th className="py-3 px-4 rounded-l-lg">Quiz Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Difficulty</th>
                      <th className="py-3 px-4">Creator</th>
                      <th className="py-3 px-4">Attempts</th>
                      <th className="py-3 px-4 rounded-r-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {quizzes.map((q) => (
                      <tr key={q._id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-bold text-slate-800 truncate max-w-[150px]" title={q.title}>
                          {q.title}
                        </td>
                        <td className="py-3 px-4 text-xs font-semibold">{q.category}</td>
                        <td className="py-3 px-4 text-xs">{q.difficulty}</td>
                        <td className="py-3 px-4 text-xs text-slate-500">{q.creator?.name || 'Anonymous'}</td>
                        <td className="py-3 px-4 font-bold">{q.attemptsCount || 0}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeleteQuiz(q._id)}
                            className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-lg transition-colors"
                            title="Delete Quiz"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
