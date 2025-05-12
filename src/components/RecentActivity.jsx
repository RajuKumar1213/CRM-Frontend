import React from "react";
import { 
  FaHistory, 
  FaPhone, 
  FaWhatsapp, 
  FaEnvelope, 
  FaUser, 
  FaEdit,
  FaRegCommentDots,
  FaExternalLinkAlt 
} from "react-icons/fa";
import { Link } from "react-router-dom";

function RecentActivity({ activity }) {
  // Handle both data structures (with userInfo/leadInfo or user/lead directly)
  const userInfo = activity?.userInfo || activity?.user;
  const leadInfo = activity?.leadInfo || activity?.lead;

  // Get appropriate icon based on activity type
  const getActivityIcon = () => {
    switch (activity?.type) {
      case "call":
        return <FaPhone size={16} />;
      case "whatsapp":
        return <FaWhatsapp size={16} />;
      case "email":
        return <FaEnvelope size={16} />;
      case "meeting":
        return <FaUser size={16} />;
      case "note":
        return <FaEdit size={16} />;
      default:
        return <FaHistory size={16} />;
    }
  };

  // Get action text based on activity type if activityLabel is not present
  const getActionText = () => {
    switch (activity?.type) {
      case "call":
        return "Made a call";
      case "whatsapp":
        return "Sent WhatsApp message";
      case "email":
        return "Sent email";
      case "meeting":
        return "Had a meeting";
      case "note":
        return "Added a note";
      default:
        return "Interacted with lead";
    }
  };

  // Get color based on activity type
  const getActivityColor = () => {
    switch (activity?.type) {
      case "call":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-500";
      case "whatsapp":
        return "bg-green-100 dark:bg-green-900/30 text-green-500";
      case "email":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-500";
      case "meeting":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500";
      case "note":
        return "bg-gray-100 dark:bg-gray-800 text-gray-500";
      default:
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-500";
    }
  };

  // Truncate notes to a reasonable length
  const truncateNotes = (text, maxLength = 50) => {
    if (!text) return "No notes";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // Get status badge style
  const getStatusBadgeStyle = () => {
    switch (activity?.status) {
      case "connected":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "not-answered":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "attempted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  // Get status label if not provided
  const getStatusLabel = () => {
    switch (activity?.status) {
      case "connected":
        return "Connected";
      case "not-answered":
        return "No answer";
      case "attempted":
        return "Attempted";
      case "completed":
        return "Completed";
      default:
        return activity?.status;
    }
  };

  return (
    <div className="flex items-start">
      <div className={`flex-shrink-0 p-2 rounded-lg mr-4 ${getActivityColor()}`}>
        {getActivityIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            <span className="font-semibold">
              {userInfo?.name || "Unknown User"}
            </span>{" "}
            {activity?.activityLabel || getActionText()}{" "}
            {(activity?.statusLabel || activity?.status) && (
              <span className={`text-xs px-2 py-0.5 rounded-full ml-1 ${getStatusBadgeStyle()}`}>
                {activity?.statusLabel || getStatusLabel()}
              </span>
            )}
          </p>
          {activity?.timeAgo && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {activity?.timeAgo}
            </span>
          )}
        </div>
        
        <p className="text-sm mt-1">
          <span className="text-gray-500 dark:text-gray-400">Lead: </span>
          <Link 
            to={`/leads/detail/${leadInfo?._id}`} 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center"
          >
            {leadInfo?.name || "Unknown Lead"}
            <FaExternalLinkAlt size={10} className="ml-1" />
          </Link>
          
          {activity?.formattedDuration && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              ({activity.formattedDuration})
            </span>
          )}
        </p>
        
        {activity?.notes && (
          <p
            className="text-sm text-gray-600 dark:text-gray-400 mt-1"
            title={activity?.notes}
          >
            {truncateNotes(activity?.notes)}
          </p>
        )}
      </div>
      <button
        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        aria-label="Add comment"
      >
        <FaRegCommentDots size={16} />
      </button>
    </div>
  );
}

export default RecentActivity;

