// Theme utility functions for handling light/dark mode
import { useState, useEffect } from 'react';
import { debugTheme } from './themeDebugger';

/**
 * Apply theme to document and localStorage
 * @param {string} theme - 'light', 'dark', or 'system' 
 */
export function applyTheme(theme) {
  if (typeof window === 'undefined') return;

  const rootElement = document.documentElement;
  debugTheme('applyTheme called', { theme });
  
  if (theme === 'dark') {
    rootElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else if (theme === 'light') {
    rootElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    // System preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    rootElement.classList.toggle('dark', prefersDark);
    localStorage.removeItem('theme');
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
 * Hook to detect and synchronize with theme changes
 * @returns {Object} Theme state and control functions
 */
export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'system';
    }
    return 'system';
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  return { theme, setTheme };
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
