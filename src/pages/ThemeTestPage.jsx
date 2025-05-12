import React from 'react';
import { useThemeContext } from '../context/ThemeContext';
import ThemePreference from '../components/ThemePreference';
import { debugTheme } from '../utils/themeDebugger';

/**
 * This component is used to test the theme functionality.
 * It displays the current theme state and provides controls to test different theme scenarios.
 */
const ThemeTestPage = () => {
  const { theme, isDarkMode, setTheme } = useThemeContext();

  // Test toggle localStorage directly
  const testDirectStorageChange = () => {
    debugTheme('Testing direct localStorage change');
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
    // Forcing a re-render would normally be handled by storage events
    window.dispatchEvent(new Event('storage'));
  };

  // Test clearing localStorage (should revert to system preference)
  const testClearStorage = () => {
    debugTheme('Testing localStorage removal');
    localStorage.removeItem('theme');
    window.dispatchEvent(new Event('storage'));
  };

  // Test simulating system preference change
  const simulateSystemPreferenceChange = () => {
    debugTheme('Simulating system preference change');
    alert('This test requires DevTools. Please go to DevTools > Rendering > Emulate CSS media feature prefers-color-scheme and toggle between light/dark.');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Theme Testing</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Theme State */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Current Theme State</h2>
          
          <div className="space-y-2">
            <p className="dark:text-gray-200">
              <strong>Theme setting:</strong> {theme}
            </p>
            <p className="dark:text-gray-200">
              <strong>Dark mode active:</strong> {isDarkMode ? 'Yes' : 'No'}
            </p>
            <p className="dark:text-gray-200">
              <strong>localStorage theme:</strong> {localStorage.getItem('theme') || 'not set (system)'}
            </p>
            <p className="dark:text-gray-200">
              <strong>System preference:</strong> {window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light'}
            </p>
            <p className="dark:text-gray-200">
              <strong>HTML class:</strong> {document.documentElement.classList.contains('dark') ? 'dark' : 'light (no dark class)'}
            </p>
          </div>
        </div>
        
        {/* Theme Preference Selector */}
        <ThemePreference />
        
        {/* Test Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Test Controls</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={testDirectStorageChange}
              className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              Test Direct Storage Change
            </button>
            
            <button
              onClick={testClearStorage}
              className="p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
            >
              Test Clear Storage
            </button>
            
            <button
              onClick={simulateSystemPreferenceChange}
              className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors"
            >
              Test System Preference
            </button>
            
            <button
              onClick={() => {
                debugTheme('Manual theme toggle');
                setTheme(isDarkMode ? 'light' : 'dark');
              }}
              className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
            >
              Toggle Theme
            </button>
            
            <button
              onClick={() => {
                debugTheme('Force theme refresh');
                const currentTheme = localStorage.getItem('theme') || 'system';
                setTheme(currentTheme);
              }}
              className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              Force Refresh Theme
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="p-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              Reload Page
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md text-sm text-yellow-800 dark:text-yellow-200">
            <p><strong>Note:</strong> Open the browser console to see detailed theme debugging information.</p>
          </div>
        </div>
        
        {/* Theme CSS Variables Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Theme Variables Demo</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-md" style={{backgroundColor: 'rgb(var(--background))'}}>
              <span className="text-xs font-mono" style={{color: 'rgb(var(--foreground))'}}>--background</span>
            </div>
            
            <div className="p-4 rounded-md" style={{backgroundColor: 'rgb(var(--foreground))'}}>
              <span className="text-xs font-mono" style={{color: 'rgb(var(--background))'}}>--foreground</span>
            </div>
            
            <div className="p-4 rounded-md" style={{backgroundColor: 'rgb(var(--primary))'}}>
              <span className="text-xs font-mono" style={{color: 'rgb(var(--primary-foreground))'}}>--primary</span>
            </div>
            
            <div className="p-4 rounded-md" style={{backgroundColor: 'rgb(var(--secondary))'}}>
              <span className="text-xs font-mono" style={{color: 'rgb(var(--secondary-foreground))'}}>--secondary</span>
            </div>
            
            <div className="p-4 rounded-md" style={{backgroundColor: 'rgb(var(--muted))'}}>
              <span className="text-xs font-mono" style={{color: 'rgb(var(--muted-foreground))'}}>--muted</span>
            </div>
            
            <div className="p-4 rounded-md" style={{backgroundColor: 'rgb(var(--card))'}}>
              <span className="text-xs font-mono" style={{color: 'rgb(var(--card-foreground))'}}>--card</span>
            </div>
            
            <div className="p-4 rounded-md border" style={{borderColor: 'rgb(var(--border))'}}>
              <span className="text-xs font-mono">--border</span>
            </div>
            
            <div className="p-4 rounded-md" style={{backgroundColor: 'rgb(var(--accent))'}}>
              <span className="text-xs font-mono" style={{color: 'rgb(var(--accent-foreground))'}}>--accent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeTestPage;
