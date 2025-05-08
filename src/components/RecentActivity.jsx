import React, { act, useEffect, useState } from "react";
import { FaHistory, FaRegCommentDots } from "react-icons/fa";
import { Link } from "react-router-dom";
import leadService from "../services/leadService";
import spinner from "/spinner.svg";

function RecentActivity({ activity }) {
  

  // Format createdAt timestamp
  const formatDateTime = (date) => {
    if (!date) return "Unknown time";
    const d = new Date(date);
    return isNaN(d.getTime())
      ? "Invalid Date"
      : d.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
  };

  // Truncate notes to a reasonable length
  const truncateNotes = (text, maxLength = 50) => {
    if (!text) return "No notes";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // Derive action text from type and status
  const getActionText = () => {
    const type = activity?.type || "unknown";
    const status = activity?.status || "unknown";
    if (type === "whatsapp" && status === "completed") {
      return "sent a WhatsApp message";
    }
    return `${type} ${status}`;
  };

  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-500 mr-4">
        <FaHistory size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          <span className="font-semibold">
            {activity?.userInfo?.name || "Unknown User"},
          </span>{" "}
          {getActionText()}{" "}
          to lead: {activity?.leadInfo?.name || "Unknown Lead"} 
        </p>
        <p
          className="text-sm text-gray-600 dark:text-gray-400 mt-1"
          title={activity?.notes || ""}
        >
          {truncateNotes(activity?.notes)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formatDateTime(activity?.createdAt)}
        </p>
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
