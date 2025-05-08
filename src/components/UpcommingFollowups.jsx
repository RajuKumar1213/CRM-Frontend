import React from 'react'
import { FaPhone } from 'react-icons/fa'
import { format } from 'date-fns'

function UpcommingFollowups({followUp, activeTab}) {
  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
    <div className="flex items-start">
      <div
        className={`flex-shrink-0 p-3 rounded-lg mr-4 ${
          followUp?.followUpType === 'call'
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-500'
            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-500'
        }`}
      >
        <FaPhone size={18} />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          {followUp?.lead.name}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Type: {followUp?.followUpType}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Scheduled: {format(new Date(followUp?.scheduled), 'MMM d, yyyy')}
        </p>
      </div>
      <span
        className={`text-xs font-medium px-2 py-1 rounded ml-auto self-center ${
          followUp?.status === 'pending'
            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
            : followUp?.status === 'completed'
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
        }`}
      >
        {followUp?.status}
      </span>
    </div>
  </div>
  )
}

export default UpcommingFollowups
