import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './layouts/ProtectedRoute';
import Navbar from './components/Navbar';

// Page Imports
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import QuizList from './pages/QuizList';
import QuizTake from './pages/QuizTake';
import QuizResults from './pages/QuizResults';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateQuiz from './pages/CreateQuiz';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          {/* Main Flex Wrapper */}
          <div className="flex flex-col min-h-screen">
            {/* Navigation top bar */}
            <Navbar />
            
            {/* Primary Router Switch */}
            <main className="flex-1 flex flex-col">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/quizzes" element={<QuizList />} />

                {/* Protected Student Routes */}
                <Route
                  path="/quiz/:id"
                  element={
                    <ProtectedRoute>
                      <QuizTake />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/results/:id"
                  element={
                    <ProtectedRoute>
                      <QuizResults />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-quiz"
                  element={
                    <ProtectedRoute>
                      <CreateQuiz />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-quiz/:id"
                  element={
                    <ProtectedRoute>
                      <CreateQuiz />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            {/* Standard Footer */}
            <footer className="bg-slate-900 text-slate-400 py-6 px-4 border-t border-slate-800 text-center text-xs">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <p>&copy; {new Date().getFullYear()} QuizMaster. All rights reserved.</p>
                <div className="flex gap-4">
                  <Link to="/quizzes" className="hover:text-white transition-colors">Browse Quizzes</Link>
                  <span>&bull;</span>
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                  <span>&bull;</span>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
              </div>
            </footer>
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
