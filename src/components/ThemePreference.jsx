import React from 'react';
import { FaMoon, FaSun, FaDesktop } from 'react-icons/fa';
import { useThemeContext } from '../context/ThemeContext';

/**
 * A more advanced theme selector with visual indicators
 */
const ThemePreference = ({ className = '' }) => {
  const { theme, setTheme } = useThemeContext();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-3 dark:text-white">Theme Preference</h3>
      
      <div className="grid grid-cols-3 gap-3">
        {/* Light theme option */}
        <button
          onClick={() => setTheme('light')}
          className={`flex flex-col items-center justify-center p-3 rounded-md transition-all duration-200 ${
            theme === 'light' 
              ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500' 
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600'
          }`}
          aria-label="Use light theme"
        >
          <FaSun className="text-yellow-500 dark:text-yellow-300 w-6 h-6 mb-2" />
          <span className="text-sm font-medium dark:text-white">Light</span>
        </button>

        {/* Dark theme option */}
        <button
          onClick={() => setTheme('dark')}
          className={`flex flex-col items-center justify-center p-3 rounded-md transition-all duration-200 ${
            theme === 'dark' 
              ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500' 
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600'
          }`}
          aria-label="Use dark theme"
        >
          <FaMoon className="text-blue-500 dark:text-blue-300 w-6 h-6 mb-2" />
          <span className="text-sm font-medium dark:text-white">Dark</span>
        </button>

        {/* System preference option */}
        <button
          onClick={() => setTheme('system')}
          className={`flex flex-col items-center justify-center p-3 rounded-md transition-all duration-200 ${
            theme === 'system' 
              ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500' 
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600'
          }`}
          aria-label="Use system preference"
        >
          <FaDesktop className="text-gray-600 dark:text-gray-300 w-6 h-6 mb-2" />
          <span className="text-sm font-medium dark:text-white">System</span>
        </button>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
        {theme === 'system' 
          ? 'Using your device preference' 
          : `Using ${theme} mode`}
      </p>
    </div>
  );
};

export default ThemePreference;
