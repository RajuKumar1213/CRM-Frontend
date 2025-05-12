import React from "react";

const Settings = () => {
  // You can add more settings here as needed (e.g., notification preferences, theme, etc.)
  return (
    <div className="max-w-lg mx-auto mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Settings</h2>
      <div className="text-gray-700 dark:text-gray-200">
        <p className="mb-2">You can update your profile and password from the Profile page.</p>
        <p className="mb-2">Theme preference can be toggled from the top right corner.</p>
        {/* Add more settings options here as your app grows */}
      </div>
    </div>
  );
};

export default Settings;
