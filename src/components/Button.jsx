import React from 'react';

const Button = ({ type = 'button', disabled, className = '', children }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white text-base sm:text-lg font-semibold rounded-md hover:bg-orange-600 dark:hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}` }
    >
      {children}
    </button>
  );
};

export default Button;