import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, Play, User as UserIcon, Award, Tag, Edit3, Trash2 } from 'lucide-react';

const QuizCard = ({ quiz, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isCreatorOrAdmin = user && (quiz.creator?._id === user._id || quiz.creator === user._id || user.role === 'admin');

  // Helper for difficulty colors
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Hard':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col h-full overflow-hidden group">
      {/* Category header tag */}
      <div className="p-5 pb-3 flex justify-between items-start">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-600 border border-primary-100">
          <Tag className="w-3.5 h-3.5" />
          {quiz.category}
        </span>
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getDifficultyBadge(quiz.difficulty)}`}>
          {quiz.difficulty}
        </span>
      </div>

      {/* Main Content */}
      <div className="px-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-primary-600 transition-colors mb-2 line-clamp-1">
            {quiz.title}
          </h3>
          <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
            {quiz.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-slate-100 mb-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary-500" />
            <span>{quiz.questions?.length || 0} Questions</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-accent" />
            <span>{quiz.attemptsCount || 0} Attempts</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 pb-5 pt-1 mt-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
          <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-sans font-semibold text-slate-600 uppercase flex-shrink-0">
            {quiz.creator?.name ? quiz.creator.name.charAt(0) : 'Q'}
          </div>
          <span className="truncate">By {quiz.creator?.name || 'Anonymous'}</span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isCreatorOrAdmin && (
            <>
              {onEdit && (
                <button
                  onClick={() => onEdit(quiz)}
                  className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-100 transition-all"
                  title="Edit Quiz"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(quiz._id)}
                  className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all"
                  title="Delete Quiz"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          <Link
            to={`/quiz/${quiz._id}`}
            className="flex items-center gap-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-md shadow-primary-600/10 hover:shadow-primary-600/20 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
