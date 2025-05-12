import React, { useEffect, useState } from 'react';
import { FaMoon, FaSun, FaDesktop } from 'react-icons/fa';

const ThemeToggle = ({ className = '' }) => {
  const getInitialTheme = () => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    // Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative inline-flex">
        <button
          onClick={toggleTheme}
          className="group flex items-center justify-center w-10 h-10 rounded-md transition-colors duration-200 hover:bg-white/10"
          aria-label="Toggle dark mode"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          data-testid="theme-toggle-button"
        >
          {theme === 'dark' ? (
            <FaSun className="text-yellow-300 w-5 h-5 transform transition-all duration-200 group-hover:rotate-12" />
          ) : (
            <FaMoon className="text-blue-300/80 w-5 h-5 transform transition-all duration-200 group-hover:-rotate-12" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;
