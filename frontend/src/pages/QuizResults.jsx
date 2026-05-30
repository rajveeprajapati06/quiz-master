import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';
import { Award, RefreshCw, BookOpen, LayoutDashboard, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

const QuizResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [details, setDetails] = useState(location.state?.attemptDetails || null);
  const [loading, setLoading] = useState(!location.state?.attemptDetails);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (!details) {
      const fetchAttemptDetails = async () => {
        try {
          const { data } = await axios.get(`/api/attempts/${id}`);
          setDetails(data);
        } catch (err) {
          console.error(err);
          showToast('Failed to load quiz results details.', 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchAttemptDetails();
    }
  }, [id, details]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="text-center py-20 bg-slate-50 flex-1 flex flex-col justify-center">
        <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Results Not Found</h2>
        <p className="text-slate-500 text-sm mt-1">We couldn't retrieve details for this quiz attempt.</p>
        <Link to="/quizzes" className="mt-6 text-primary-600 font-bold hover:underline">
          Go back to Quizzes
        </Link>
      </div>
    );
  }

  const { attempt, resultsSummary } = details;
  const isPass = attempt.passed;

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
      {/* Visual Header Banner */}
      <div
        className={`rounded-3xl p-8 text-center text-white shadow-xl relative overflow-hidden mb-8 ${
          isPass
            ? 'bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-600'
            : 'bg-gradient-to-br from-rose-500 via-pink-600 to-rose-600'
        }`}
      >
        {/* Ambience patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
            <Award className="h-10 w-10 text-white" />
          </div>
          <span className="text-xs font-bold tracking-widest bg-white/20 px-3.5 py-1 rounded-full uppercase mb-2 backdrop-blur-sm">
            {isPass ? 'COMPLETED - PASSED' : 'COMPLETED - FAILED'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            {isPass ? 'Congratulations! You Passed!' : 'Keep Learning, Try Again!'}
          </h1>
          <p className="text-white/80 text-sm max-w-md mx-auto">
            {isPass
              ? 'Excellent job! You have demonstrated great understanding of this topic. Keep up the high standard!'
              : 'You didn\'t score enough to pass this time. Take a look at the answers review below, study up, and try again.'}
          </p>
        </div>
      </div>

      {/* Visual Statistics Circular Ring / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {/* Score widget */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-premium flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Score Percentage</span>
          <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border-8 ${isPass ? 'border-emerald-100 text-emerald-600' : 'border-rose-100 text-rose-500'}`}>
            <span className="text-2xl font-black">{attempt.percentage}%</span>
          </div>
        </div>

        {/* Total Questions / Points */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-premium flex flex-col justify-center">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">SCORE DETAILS</span>
          <p className="text-3xl font-black text-slate-800">
            {attempt.score} <span className="text-slate-400 text-lg font-semibold">/ {resultsSummary.length}</span>
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">Correct questions answered.</p>
        </div>

        {/* Date / Time */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-premium flex flex-col justify-center">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">SUBMITTED ON</span>
          <p className="text-base font-bold text-slate-800">
            {new Date(attempt.submittedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            {new Date(attempt.submittedAt).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      {/* Buttons Options */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        <Link
          to={`/quiz/${attempt.quiz?._id || attempt.quiz}`}
          className="flex-1 min-w-[140px] text-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-primary-600/10 hover:shadow-primary-600/20 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retake Quiz</span>
        </Link>
        <Link
          to="/quizzes"
          className="flex-1 min-w-[140px] text-center bg-white border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>Browse Quizzes</span>
        </Link>
        <Link
          to="/dashboard"
          className="flex-1 min-w-[140px] text-center bg-white border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* Explanations Collapse Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-premium overflow-hidden">
        <button
          onClick={() => setShowReview(!showReview)}
          className="w-full px-6 py-4 flex items-center justify-between font-bold text-slate-800 text-base focus:outline-none hover:bg-slate-50/50 transition-colors"
        >
          <span>Review Correct Answers</span>
          {showReview ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>

        {showReview && (
          <div className="border-t border-slate-100 p-6 space-y-6 bg-slate-50/50">
            {resultsSummary.map((q, qIndex) => (
              <div key={qIndex} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start gap-2.5 mb-4">
                  {q.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-400">QUESTION {qIndex + 1}</span>
                    <h3 className="font-bold text-slate-800 mt-0.5 leading-relaxed">{q.questionText}</h3>
                  </div>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
                  {q.options.map((option, oIndex) => {
                    const isSelected = q.chosenAnswer === oIndex;
                    const isCorrectOption = q.correctAnswer === oIndex;

                    let bgClass = 'bg-slate-50 border-slate-200 text-slate-700';

                    if (isCorrectOption) {
                      bgClass = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold';
                    } else if (isSelected && !isCorrectOption) {
                      bgClass = 'bg-rose-50 border-rose-300 text-rose-800';
                    }

                    return (
                      <div
                        key={oIndex}
                        className={`p-3.5 rounded-xl border text-sm flex items-center justify-between ${bgClass}`}
                      >
                        <span>{option}</span>
                        {isCorrectOption && (
                          <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded font-bold uppercase">
                            Correct
                          </span>
                        )}
                        {isSelected && !isCorrectOption && (
                          <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded font-bold uppercase">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResults;
