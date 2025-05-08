// src/utils/persistAuth.js
export const loadAuthState = () => {
    try {
      const serializedState = localStorage.getItem('authState');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
  };
  
  export const saveAuthState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('authState', serializedState);
    } catch {
      // ignore errors
    }
  };