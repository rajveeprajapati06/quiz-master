import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, BookOpen, User as UserIcon, LogOut, Award, ShieldAlert, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="glass sticky top-0 z-40 bg-white/95 border-b border-slate-200/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-primary-600 text-white p-2 rounded-xl shadow-md shadow-primary-600/20 group-hover:bg-primary-700 transition-colors">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                QuizMaster
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              <Link
                to="/quizzes"
                className="text-slate-600 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Browse Quizzes
              </Link>
              {user && (
                <>
                  <Link
                    to="/create-quiz"
                    className="text-slate-600 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Quiz</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className="text-slate-600 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                </>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-amber-600 hover:text-amber-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Right items */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
                  <div className="h-6 w-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold font-sans">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-700 text-sm font-medium max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-rose-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-primary-600/10 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white py-2 px-4 space-y-1">
          <Link
            to="/quizzes"
            onClick={() => setIsOpen(false)}
            className="block text-slate-700 hover:text-primary-600 hover:bg-slate-50 px-3 py-2 rounded-lg text-base font-medium transition-colors"
          >
            Browse Quizzes
          </Link>
          {user && (
            <>
              <Link
                to="/create-quiz"
                onClick={() => setIsOpen(false)}
                className="block text-slate-700 hover:text-primary-600 hover:bg-slate-50 px-3 py-2 rounded-lg text-base font-medium transition-colors"
              >
                Create Quiz
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block text-slate-700 hover:text-primary-600 hover:bg-slate-50 px-3 py-2 rounded-lg text-base font-medium transition-colors"
              >
                Dashboard
              </Link>
            </>
          )}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="block text-amber-700 hover:text-amber-800 hover:bg-amber-50 px-3 py-2 rounded-lg text-base font-medium transition-colors"
            >
              Admin Panel
            </Link>
          )}
          <hr className="border-slate-200 my-2" />
          {user ? (
            <div className="pt-2 pb-1 space-y-2">
              <div className="flex items-center px-3 py-1.5 space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-slate-800 font-semibold">{user.name}</div>
                  <div className="text-slate-500 text-xs">{user.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left text-slate-700 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg text-base font-medium transition-colors flex items-center space-x-1"
              >
                <LogOut className="h-5 w-5 mr-1" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2 pb-1">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-center text-slate-700 hover:text-primary-600 hover:bg-slate-50 py-2 rounded-lg text-base font-medium border border-slate-200 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="text-center bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg text-base font-semibold transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
