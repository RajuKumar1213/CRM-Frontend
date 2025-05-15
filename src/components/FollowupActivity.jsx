import React from "react";
import { FaCalendarCheck, FaHourglassHalf, FaUser, FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { format } from 'timeago.js';

function FollowupActivity({ followup }) {
  const lead = followup?.lead;
  const assignedTo = followup?.assignedTo;
  const isOverdue = new Date(followup.scheduled) < new Date();

  return (
    <div className="flex items-start">
      <div className={`flex-shrink-0 p-2 rounded-lg mr-4 ${isOverdue ? 'bg-red-100 dark:bg-red-900/20 text-red-500' : 'bg-green-100 dark:bg-green-900/20 text-green-500'}`}>
        {isOverdue ? <FaHourglassHalf size={16} /> : <FaCalendarCheck size={16} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            <span className="font-semibold">
              {lead?.name || "Unknown Lead"}
            </span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-semibold "
              style={{ background: isOverdue ? '#fee2e2' : '#d1fae5', color: isOverdue ? '#b91c1c' : '#047857' }}>
              {isOverdue ? 'Overdue' : 'Upcoming'}
            </span>
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {format(followup.scheduled)}
          </span>
        </div>
        <p className="text-sm mt-1">
          <span className="text-gray-500 dark:text-gray-400">Assigned to: </span>
          <span className="inline-flex items-center">
            <FaUser className="mr-1" />
            {assignedTo?.name || 'Unassigned'}
          </span>
        </p>
        <p className="text-sm mt-1">
          <span className="text-gray-500 dark:text-gray-400">Lead: </span>
          <Link 
            to={`/leads/detail/${lead?._id}`} 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center"
          >
            {lead?.name || "Unknown Lead"}
            <FaExternalLinkAlt size={10} className="ml-1" />
          </Link>
        </p>
        {followup?.notes && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1" title={followup?.notes}>
            {followup.notes.length > 50 ? followup.notes.slice(0, 50) + '...' : followup.notes}
          </p>
        )}
      </div>
    </div>
  );
}

export default FollowupActivity;
