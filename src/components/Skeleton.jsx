import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaTag,
  FaClock,
  FaArrowLeft,
  FaWhatsapp,
  FaInfoCircle,
  FaUserTie,
  FaCalendarAlt
} from "react-icons/fa";

function Skeleton() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <FaArrowLeft />
            <span className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></span>
          </button>
          <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lead Info Card Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="flex space-x-2">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 animate-pulse"></div>
                      <div className="ml-3 w-full">
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Follow Ups Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
              <ul className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <li key={i} className="border-l-4 border-gray-200 dark:border-gray-700 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                        <div className="flex items-center">
                          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full mr-2 animate-pulse"></div>
                          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full mr-2 animate-pulse"></div>
                      <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Lead Details Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                    <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Timeline Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="flow-root">
                <ul className="-mb-8">
                  {[...Array(3)].map((_, i) => (
                    <li key={i}>
                      <div className="relative pb-8">
                        {i !== 2 && (
                          <span
                            className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-600"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skeleton;