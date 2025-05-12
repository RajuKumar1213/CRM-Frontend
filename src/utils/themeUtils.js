// Theme utility functions for handling light/dark mode
import { useState, useEffect } from 'react';
import { debugTheme } from './themeDebugger';

/**
 * Hook to detect and synchronize with theme changes
 * @returns {Object} Theme state and control functions
 */
export function useTheme() {
  // Initialize theme from localStorage or system preference
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'system';
    }
    return 'system';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('theme') === 'dark') return true;
      if (localStorage.getItem('theme') === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(theme);
    
    const darkModeValue = 
      theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(darkModeValue);
    debugTheme('Theme changed', { theme, isDarkMode: darkModeValue });
  }, [theme]);

  // Watch for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        document.documentElement.classList.toggle('dark', mediaQuery.matches);
        setIsDarkMode(mediaQuery.matches);
        debugTheme('System theme changed while in system mode', { isDark: mediaQuery.matches });
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Listen for theme changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        setThemeState(e.newValue || 'system');
        debugTheme('Theme changed from another tab', { newTheme: e.newValue || 'system' });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Theme changing functions
  const setTheme = (newTheme) => {
    debugTheme('setTheme called', { oldTheme: theme, newTheme });
    setThemeState(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      // System preference
      localStorage.removeItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
    
    // Broadcast theme change
    const event = new CustomEvent('theme-change', { detail: { theme: newTheme } });
    window.dispatchEvent(event);
  };

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    debugTheme('toggleTheme called', { oldTheme: theme, newTheme, isDarkMode });
    setTheme(newTheme);
  };

  return { theme, isDarkMode, setTheme, toggleTheme };
}

/**
 * Apply theme to document and localStorage
 * @param {string} theme - 'light', 'dark', or 'system' 
 */
export function applyTheme(theme) {
  if (typeof window === 'undefined') return;

  debugTheme('applyTheme called', { theme });
  
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else if (theme === 'light') {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    // System preference
    localStorage.removeItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  }
}

/**
 * Get current theme
 * @returns {string} Current theme ('light', 'dark', or 'system')
 */
export function getTheme() {
  if (typeof window === 'undefined') return 'system';
  return localStorage.getItem('theme') || 'system';
}

/**
 * Hook for initializing theme on app load
 */
export function useThemeInitializer() {
  useEffect(() => {
    // On page load, apply theme from localStorage or system preference
    const currentTheme = localStorage.getItem('theme') || 'system';
    applyTheme(currentTheme);
    
    // Initialize the theme debugger in non-production environments
    const cleanup = initThemeDebugger();
    
    // Log theme initialization
    debugTheme('Theme initialized in useThemeInitializer', {
      theme: currentTheme,
      isDark: document.documentElement.classList.contains('dark')
    });
    
    return cleanup;
  }, []);
}

/**
 * Initialize theme debugger to monitor theme changes
 */
function initThemeDebugger() {
  try {
    const { initThemeDebugger: init } = require('./themeDebugger');
    return init();
  } catch (error) {
    console.log('Theme debugger not available');
    return () => {};
  }
}
