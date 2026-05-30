import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => {
          let bgColor = 'bg-white';
          let borderLeftColor = 'border-l-blue-500';
          let Icon = Info;
          let iconColor = 'text-blue-500';

          if (toast.type === 'success') {
            borderLeftColor = 'border-l-emerald-500';
            Icon = CheckCircle;
            iconColor = 'text-emerald-500';
          } else if (toast.type === 'error') {
            borderLeftColor = 'border-l-rose-500';
            Icon = XCircle;
            iconColor = 'text-rose-500';
          } else if (toast.type === 'warning') {
            borderLeftColor = 'border-l-amber-500';
            Icon = AlertTriangle;
            iconColor = 'text-amber-500';
          }

          return (
            <div
              key={toast.id}
              className={`flex items-start p-4 bg-white text-slate-800 rounded-lg shadow-xl border-l-4 ${borderLeftColor} animate-[fadeIn_0.2s_ease-out]`}
            >
              <div className="flex-shrink-0">
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div className="ml-3 mr-4 flex-1">
                <p className="text-sm font-medium leading-5">{toast.message}</p>
              </div>
              <div className="flex-shrink-0 flex">
                <button
                  onClick={() => removeToast(toast.id)}
                  className="inline-flex text-slate-400 hover:text-slate-500 focus:outline-none transition duration-155"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
