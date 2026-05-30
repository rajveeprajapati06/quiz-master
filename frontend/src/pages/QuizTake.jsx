import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, AlertTriangle, Play, HelpCircle } from 'lucide-react';

const QuizTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // App states
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Mapping of index -> chosen option index (0-3)
  const [submitting, setSubmitting] = useState(false);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await axios.get(`/api/quizzes/${id}`);
        setQuiz(data);
        // Default timer: 30 seconds per question
        setTimeLeft(data.questions.length * 30);
      } catch (err) {
        console.error(err);
        showToast('Failed to load quiz. Returning to browse.', 'error');
        navigate('/quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  // Timer effect
  useEffect(() => {
    if (started && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            showToast('Time is up! Submitting your answers...', 'warning');
            handleSubmit(true); // Forced submit when time is up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [started, timeLeft]);

  const handleSelectOption = (oIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: oIndex,
    });
  };

  const handleNext = () => {
    // Check if current question has an answer selected
    if (selectedAnswers[currentQuestionIndex] === undefined) {
      showToast('Please select an option before moving forward.', 'warning');
      return;
    }
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async (forced = false) => {
    // Collect answers array
    const questionsCount = quiz.questions.length;
    const answersArray = [];

    for (let i = 0; i < questionsCount; i++) {
      const ans = selectedAnswers[i];
      if (ans === undefined) {
        if (forced) {
          // If forced submit due to timeout, assign a dummy incorrect answer (-1)
          answersArray.push(-1);
        } else {
          showToast(`Please answer question #${i + 1} before submitting.`, 'warning');
          return;
        }
      } else {
        answersArray.push(ans);
      }
    }

    setSubmitting(true);
    clearInterval(timerRef.current);

    try {
      const { data } = await axios.post('/api/attempts', {
        quizId: quiz._id,
        answers: answersArray,
      });

      showToast('Quiz submitted successfully!', 'success');
      // Navigate to results page passing data in state
      navigate(`/results/${data.attempt._id}`, { state: { attemptDetails: data } });
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to submit quiz', 'error');
      setSubmitting(false);
    }
  };

  // Helper for formatting time (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center py-20 px-4 text-center">
        <Spinner size="lg" className="mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Evaluating Your Answers...</h2>
        <p className="text-slate-500 text-sm mt-1">Please wait while we compute your score.</p>
      </div>
    );
  }

  // Pre-quiz Screen
  if (!started) {
    return (
      <div className="flex-1 bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-2xl shadow-premium p-6 sm:p-8 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold bg-primary-50 text-primary-600 px-3 py-1 rounded-full border border-primary-100 uppercase tracking-wider">
                {quiz.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2 tracking-tight">
                {quiz.title}
              </h1>
              <p className="text-slate-500 text-sm mt-1">Created by {quiz.creator?.name || 'Anonymous'}</p>
            </div>
            <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-200 rounded-md">
              {quiz.difficulty}
            </span>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-bold text-slate-800">Quiz Description</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{quiz.description}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-sm text-slate-600 font-medium">
              <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                <HelpCircle className="w-5 h-5 text-primary-500" />
                <span>{quiz.questions.length} Questions</span>
              </div>
              <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                <Clock className="w-5 h-5 text-amber-500" />
                <span>Time Limit: {formatTime(timeLeft)} mins</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl flex items-start space-x-2.5 text-xs text-amber-800 mt-4 leading-relaxed">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div>
                <span className="font-bold">Instructions:</span> You must answer each question before proceeding to the next. The quiz is evaluated immediately upon submission. You need a score of <span className="font-bold text-slate-900">60% or higher</span> to pass the quiz.
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/quizzes')}
              className="flex-1 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setStarted(true)}
              className="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-primary-600/10 hover:shadow-primary-600/20 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Quiz</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz taking layout
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="flex-1 bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-start max-w-3xl mx-auto w-full">
      {/* Top Status (Progress and Timer) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-premium p-4 sm:p-5 mb-6 flex items-center justify-between gap-4">
        <div>
          <span className="text-slate-400 text-xs font-bold font-sans">QUESTION PROGRESS</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-black text-slate-800 leading-none">{currentQuestionIndex + 1}</span>
            <span className="text-slate-400 text-sm font-semibold">/ {totalQuestions}</span>
          </div>
        </div>

        {/* Visual Countdown Timer */}
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl font-mono text-sm font-bold text-slate-700">
          <Clock className={`w-4 h-4 ${timeLeft < 20 ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
          <span className={timeLeft < 20 ? 'text-rose-600' : 'text-slate-800'}>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-6">
        <div
          className="bg-primary-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Active Question Box */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-premium p-6 sm:p-8 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-6 leading-relaxed">
            {currentQuestion.questionText}
          </h2>

          {/* Options Buttons */}
          <div className="space-y-4">
            {currentQuestion.options.map((option, oIndex) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === oIndex;

              return (
                <button
                  key={oIndex}
                  onClick={() => handleSelectOption(oIndex)}
                  className={`w-full text-left p-4 rounded-xl border-2 font-medium text-sm sm:text-base flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50/40 text-primary-800'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span>{option}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Foot Nav Buttons */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100 gap-4">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="px-5 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              onClick={handleNext}
              className="px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-md shadow-primary-600/10 transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => handleSubmit(false)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/10 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Quiz</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTake;
