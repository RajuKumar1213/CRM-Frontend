import React from "react";
import { FaUserPlus, FaChartLine, FaTasks, FaDollarSign } from "react-icons/fa";

const DashboardSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen pt-16">
      {/* Top Bar Skeleton */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="flex items-center space-x-4">
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner Skeleton */}
        <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl p-6 mb-8 animate-pulse h-40"></div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity Skeleton */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                      <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Leads Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                      <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Upcoming Meetings Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="p-4">
              {[1, 2].map((item) => (
                <div key={item} className="mb-4">
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Performance Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="p-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mr-3"></div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;