/**
 * Utility for debugging theme-related issues
 * Use this to trace theme changes and identify issues
 */

// Log theme-related events with timestamp for debugging
export const debugTheme = (event, details = {}) => {
  if (process.env.NODE_ENV !== 'production') {
    const timestamp = new Date().toISOString();
    console.group(`🎨 Theme Debug [${timestamp}]: ${event}`);
    
    // Log current theme state
    console.log('HTML class:', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    console.log('LocalStorage theme:', localStorage.getItem('theme') || 'not set (system)');
    console.log('System preference:', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Log any additional details
    if (Object.keys(details).length > 0) {
      console.log('Details:', details);
    }
    
    console.groupEnd();
  }
};

// Monitor theme changes and log them
export const initThemeDebugger = () => {
  if (process.env.NODE_ENV !== 'production') {
    // Log initial theme state
    debugTheme('Theme debugger initialized');
    
    // Monitor local storage changes
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      if (key === 'theme') {
        debugTheme('localStorage.theme changed', {oldValue: localStorage.getItem('theme'), newValue: value});
      }
      originalSetItem.apply(this, arguments);
    };
    
    // Monitor class changes on document element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          debugTheme('HTML dark class changed', {isDark});
        }
      });
    });
    
    observer.observe(document.documentElement, {attributes: true});
    
    // Monitor system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      debugTheme('System preference changed', {isDark: e.matches});
    });
    
    // Return cleanup function
    return () => {
      localStorage.setItem = originalSetItem;
      observer.disconnect();
    };
  }
  
  return () => {}; // Empty cleanup for production
};