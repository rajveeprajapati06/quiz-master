import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-solid border-primary-600 border-t-transparent`}
      ></div>
    </div>
  );
};

export default Spinner;
