import React from "react";
import { FaUser, FaSearch, FaFilter, FaPlus, FaHistory, FaChartBar } from "react-icons/fa";

const LeadSkeleton = () => {
  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Header Skeleton */}
      <header className="py-4 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mr-2 animate-pulse"></div>
          <div className="h-6 w-40 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar Skeleton */}
        <aside className="w-full md:w-64 p-4 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="mb-6">
            <div className="relative bg-white dark:bg-gray-700 rounded-md shadow-sm mb-4 h-10 animate-pulse"></div>
            
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-md mb-2 animate-pulse"></div>
            ))}
          </div>

          <div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 mr-2 animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            </div>
            <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-md mb-2 animate-pulse"></div>
            <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-md mt-2 animate-pulse"></div>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="h-6 w-40 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full h-20 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeadSkeleton;