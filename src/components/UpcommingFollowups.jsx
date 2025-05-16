import React, { useState, useEffect } from "react";
import { FaPhone, FaCalendar, FaCheck, FaWhatsapp, FaArrowLeft, FaUser, FaBuilding } from "react-icons/fa";

import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import followUpService from "../services/followupService";
import whatsappService from "../services/whatsappService";
import callService from "../services/callService";
import WhatsappTemplate from "./WhatsappTemplate";
import CallLogModal from "./CallLogModal";
import Loading from "./Loading";
import { useForm } from "react-hook-form";
import { LEAD_STATUSES } from '../utils/constants';

function UpcommingFollowups({ followUp, onSuccess }) {
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [showCallLogModal, setShowCallLogModal] = useState(false);
  const [whatsappTemplates, setWhatsappTemplates] = useState([]);
  const [loading, setLoading] = useState(false);



  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch WhatsApp templates when WhatsApp modal opens
  useEffect(() => {
    if (isWhatsAppModalOpen) {
      setLoading(true);
      whatsappService
        .getWhatsappTemplates()
        .then((response) => {
          if (response.statusCode === 200) {
            setWhatsappTemplates(response.data.templates || []);
          } else {
            setWhatsappTemplates([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching WhatsApp templates:", error);
          toast.error("Failed to load WhatsApp templates");
          setWhatsappTemplates([]);
        })
        .finally(() => setLoading(false));
    }
  }, [isWhatsAppModalOpen]); // Handle marking follow-up as completed

  // const handleComplete = async () => {
  //   if (followUp.status === "completed") return;

  //   setIsFormSubmitting(true);
  //   const originalStatus = followUp.status;

  //   try {
  //     const response = await followUpService.updateFollowUp(followUp._id, {
  //       status: "completed",
  //     });
  //     if (response.statusCode !== 200) {
  //       throw new Error("Failed to update follow-up");
  //     }
  //     toast.success("Follow-up marked as completed!");
  //     onSuccess();
  //   } catch (error) {
  //     toast.error(error.message || "Failed to complete follow-up");
  //   } finally {
  //     setIsFormSubmitting(false);
  //   }
  // };
  const handleReschedule = async (data) => {
    setIsFormSubmitting(true);
    try {
      // Set default time to 12:00 PM if not provided
      const timeValue = data.time || "12:00";
      const scheduledDate = new Date(
        `${data.date}T${timeValue}:00`
      ).toISOString();

      // Update the follow-up with all data
      const response = await followUpService.updateFollowUp(followUp._id, {
        scheduled: scheduledDate,
        notes: data.notes || "",
        status: data.status || followUp.status, // Include status update
      });

      if (response.statusCode !== 200) {
        throw new Error("Failed to schedule follow-up");
      }
      toast.success("Follow-up rescheduled successfully!");
      onSuccess();
      setShowRescheduleForm(false);
      reset();
    } catch (error) {
      console.error("Error scheduling follow-up:", error);
      toast.error(error.message || "Failed to reschedule follow-up");
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleCallLogSubmit = async (data) => {
    try {
      await callService.logCall({
        leadId: followUp.lead._id,
        ...data
      });
      
      toast.success("Call logged successfully");
      setShowCallLogModal(false);
      
      if (data.followUpDateTime) {
        toast.success("Follow-up scheduled");
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error logging call:", error);
      toast.error(error.message || "Failed to log call");
    }
  };

  const handleCall = async () => {
    try {
      // Open native dialer
      window.location.href = `tel:${followUp.lead.phone}`;
      // Show call log modal after a short delay
      setTimeout(() => setShowCallLogModal(true), 500);
    } catch (error) {
      console.error("Error initiating call:", error);
      toast.error("Failed to initiate call");
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-start">        <Link
          to={`/leads/${followUp.lead?._id}`}
          className={`flex-shrink-0 p-3 rounded-lg mr-4 flex items-center justify-center w-12 h-12 ${
            followUp?.followUpType === "call"
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-500"
              : followUp?.followUpType === "whatsapp"
              ? "bg-green-100 dark:bg-green-900/30 text-green-500"
              : followUp?.followUpType === "email"
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-500"
              : followUp?.followUpType === "meeting"
              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-500"
              : "bg-gray-100 dark:bg-gray-900/30 text-gray-500"
          } hover:opacity-80 transition-opacity`}
        >
          {followUp?.lead?.name ? (
            <span className="text-lg font-bold">
              {followUp.lead.name
                .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)\s+/i, "")
                .trim()
                .charAt(0)
                .toUpperCase()}
            </span>
          ) : (
            <FaPhone size={14} />
          )}
        </Link>
        <div className="flex-1">          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                to={`/leads/${followUp.lead?._id}`}
                className="font-medium hover:text-orange-500 transition-colors"
              >
                {followUp?.lead?.name || "Unknown Lead"}
              </Link>
              {followUp?.lead?.source && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                  followUp.lead.source === "whatsapp" 
                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 border border-green-200 dark:border-green-700"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}>
                  {followUp.lead.source}
                </span>
              )}
            </div>
            
            {/* Optional badge for showing if lead's last contact was recent */}
            {followUp?.lead?.lastContacted && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {(() => {
                  const lastContact = new Date(followUp.lead.lastContacted);
                  const now = new Date();
                  const diffHours = Math.floor((now - lastContact) / (1000 * 60 * 60));
                  
                  if (diffHours < 24) {
                    return <span className="text-green-500 dark:text-green-400">
                      {diffHours < 1 ? 'Just now' : `${diffHours}h ago`}
                    </span>;
                  }
                  return null;
                })()}
              </span>
            )}
          </div>
            
          <div className="flex flex-wrap items-center mt-1 gap-1">
            <span 
              className={`text-xs px-2 py-0.5 rounded-full ${
                followUp?.followUpType === "call"
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-500 border border-blue-200 dark:border-blue-700"
                : followUp?.followUpType === "whatsapp"
                ? "bg-green-100 dark:bg-green-900/30 text-green-500 border border-green-200 dark:border-green-700"
                : followUp?.followUpType === "email"
                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-500 border border-orange-200 dark:border-orange-700"
                : followUp?.followUpType === "meeting"
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-500 border border-purple-200 dark:border-purple-700"
                : "bg-gray-100 dark:bg-gray-900/30 text-gray-500 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {followUp?.followUpType || "call"}
            </span>
            
            {followUp?.lead?.phone && (
              <a 
                href={`tel:${followUp.lead.phone}`} 
                className="flex items-center text-xs text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <FaPhone className="mr-1" size={10} />
                {followUp.lead.phone}
              </a>
            )}
            
            {followUp?.lead?.company && (
              <span className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <FaBuilding className="mr-1" size={10} />
                {followUp.lead.company}
              </span>
            )}
            
            {/* WhatsApp source indicator for quick visibility */}
            {followUp?.lead?.source === "whatsapp" && (
              <span className="flex items-center text-xs text-green-600 dark:text-green-400">
                <FaWhatsapp className="mr-1" size={10} />
                WhatsApp Lead
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Scheduled:{" "}
            {format(new Date(followUp?.scheduled), "MMM d, yyyy 'at' h:mm a")}
          </p>
          {followUp?.notes && (
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
              <span className="font-medium">Notes:</span> {followUp.notes}
            </p>
          )}          {followUp?.lead?.interestedIn && (
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              <span className="font-medium">Interested In:</span> {followUp.lead.interestedIn}
            </p>
          )}
          
          {followUp?.assignedTo && (
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              <span className="font-medium">Assigned to:</span> {followUp.assignedTo.name || ""}
              {followUp.assignedTo.email && ` (${followUp.assignedTo.email})`}
            </p>
          )}</div>
        <div className="flex flex-col items-end ml-4 self-start">
          <span
            className={`text-xs font-medium px-2 py-1 rounded mb-2 ${
              (() => {
                switch (followUp?.status) {
                  case 'won': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
                  case 'lost': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
                  case 'in-progress': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200';
                  case 'negotiating': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200';
                  case 'qualified': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200';
                  case 'proposal-sent': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
                  case 'on-hold': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200';
                  case 'contacted': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
                  case 'new': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200';
                  default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200';
                }
              })()
            }`}
          >
            {followUp?.status}
          </span>
          
          {followUp?.lead?.status && followUp?.lead?.status !== followUp?.status && LEAD_STATUSES.includes(followUp?.lead?.status) && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded mb-1 ${
                (() => {
                  switch (followUp?.lead?.status) {
                    case 'won': return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300';
                    case 'lost': return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300';
                    case 'in-progress': return 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300';
                    case 'negotiating': return 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300';
                    case 'qualified': return 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-300';
                    case 'proposal-sent': return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-300';
                    case 'on-hold': return 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300';
                    case 'contacted': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300';
                    case 'new': return 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-300';
                    default: return 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-300';
                  }
                })()
              }`}
            >
              Lead: {followUp.lead.status}
            </span>
          )}
          
          {/* Time remaining badge */}
          {(() => {
            const now = new Date();
            const scheduled = new Date(followUp?.scheduled);
            const diffMs = scheduled - now;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            // Only show if in the future
            if (diffMs > 0) {
              return (
                <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                  {diffDays > 0 ? `${diffDays}d ` : ''}{diffHours}h remaining
                </span>
              );
            } else if (diffMs < 0 && diffMs > -24 * 60 * 60 * 1000) {
              // If today but passed time
              return (
                <span className="text-xs mt-2 text-red-500 dark:text-red-400">
                  Overdue by {Math.abs(diffHours)}h
                </span>
              );
            }
            return null;
          })()}
        </div>
      </div>{" "}      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap gap-2 animate-[fadeIn_0.3s_ease-in-out]">
        {followUp?.lead?.phone && (
          <>
            {followUp?.lead?.source === "whatsapp" ? (
              <>
                <button
                  onClick={() => setIsWhatsAppModalOpen(true)}
                  className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 rounded-md transform hover:scale-105 transition-all duration-200"
                  aria-label={`Message ${followUp.lead.name} on WhatsApp`}
                >
                  <FaWhatsapp className="mr-1.5" />
                  WhatsApp
                </button>
                <button
                  onClick={handleCall}
                  className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md transform hover:scale-105 transition-all duration-200"
                  aria-label={`Call ${followUp.lead.name}`}
                >
                  <FaPhone className="mr-1.5" />
                  Call
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCall}
                  className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md transform hover:scale-105 transition-all duration-200"
                  aria-label={`Call ${followUp.lead.name}`}
                >
                  <FaPhone className="mr-1.5" />
                  Call
                </button>
                <button
                  onClick={() => setIsWhatsAppModalOpen(true)}
                  className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 rounded-md transform hover:scale-105 transition-all duration-200"
                  aria-label={`Message ${followUp.lead.name} on WhatsApp`}
                >
                  <FaWhatsapp className="mr-1.5" />
                  WhatsApp
                </button>
              </>
            )}
          </>
        )}
        
        <button
          onClick={() => setShowRescheduleForm(!showRescheduleForm)}
          className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md transform hover:scale-105 transition-all duration-200"
          aria-label="Reschedule follow-up"
        >
          <FaCalendar className="mr-1.5" />
          Reschedule
        </button>
        
        {!(followUp?.status === "completed" || followUp?.status === "missed") && (
          <>
            <button
              onClick={async () => {
                setIsFormSubmitting(true);
                try {
                  const response = await followUpService.updateFollowUp(
                    followUp._id,
                    { status: "completed" }
                  );
                  if (response.statusCode !== 200 && response.statusCode !== 201) {
                    throw new Error(response.message || "Failed to update follow-up");
                  }
                  toast.success("Follow-up marked as completed!");
                  if (typeof onSuccess === "function") onSuccess();
                } catch (error) {
                  toast.error(error.message || "Failed to mark as completed");
                } finally {
                  setIsFormSubmitting(false);
                }
              }}
              disabled={isFormSubmitting}
              className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
              aria-label="Mark follow-up as completed"
            >
              <FaCheck className="mr-1.5" />
              {isFormSubmitting ? "Marking..." : "Complete"}
            </button>
            <button
              onClick={async () => {
                setIsFormSubmitting(true);
                try {
                  const response = await followUpService.updateFollowUp(
                    followUp._id,
                    { status: "missed" }
                  );
                  if (response.statusCode !== 200 && response.statusCode !== 201) {
                    throw new Error(response.message || "Failed to update follow-up");
                  }
                  toast.success("Follow-up marked as missed!");
                  if (typeof onSuccess === "function") onSuccess();
                } catch (error) {
                  toast.error(error.message || "Failed to mark as missed");
                } finally {
                  setIsFormSubmitting(false);
                }
              }}
              disabled={isFormSubmitting}
              className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
              aria-label="Mark follow-up as missed"
            >
              <FaCheck className="mr-1.5" />
              {isFormSubmitting ? "Marking..." : "Missed"}
            </button>
          </>
        )}
      </div>      {/* Reschedule Form */}
      {showRescheduleForm && (
        <form
          onSubmit={handleSubmit(handleReschedule)}
          className="mt-4 p-6 bg-white dark:bg-gray-800/95 rounded-xl border border-gray-200 dark:border-gray-700/60 shadow-xl backdrop-blur-sm space-y-4 transform transition-all duration-200"
        >
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700/60 pb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Reschedule Follow-up for {followUp?.lead?.name || "Lead"}
            </h3>
            <button
              type="button"
              onClick={() => setShowRescheduleForm(false)}
              className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                {...register("date", { required: "Date is required" })}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-inner transition-colors"
                aria-label="Follow-up date"
              />
              {errors.date && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1.5">
                  {errors.date.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Time
              </label>
              <input
                type="time"
                id="time"
                {...register("time")}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-inner transition-colors"
                aria-label="Follow-up time"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Follow-up Status
            </label>
            <select
              id="status"
              defaultValue={followUp.status}
              {...register("status")}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-inner transition-colors"
            >
              {LEAD_STATUSES.map(status => (
                <option key={status} value={status}>{status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
              ))}
            </select>
          </div>
          
          <div className="mt-4">
            <label
              htmlFor="rescheduleNotes"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Notes
            </label>
            <textarea
              id="rescheduleNotes"
              {...register("notes")}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-inner transition-colors"
              placeholder="Enter notes for this follow-up..."
              rows={3}
              aria-label="Reschedule notes"
            />
          </div>
          
          <div className="flex justify-end items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700/60">
            <button
              type="button"
              onClick={() => setShowRescheduleForm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-600/50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFormSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {isFormSubmitting ? "Scheduling..." : "Reschedule"}
            </button>
          </div>
        </form>
      )}{/* WhatsApp Modal */}
      {isWhatsAppModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto transform scale-95 animate-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Send WhatsApp to {followUp?.lead?.name || "Lead"}
              </h3>
              <button
                onClick={() => setIsWhatsAppModalOpen(false)}
                className="flex items-center gap-2 text-orange-400 hover:text-orange-500 cursor-pointer px-3 py-1 rounded-lg transition-all"
              >
                <FaArrowLeft/> Close
              </button>
            </div>
              {/* Lead Info Context */}
            <div className="bg-gray-50 dark:bg-gray-750 p-3 rounded-lg mb-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">{followUp?.lead?.name || "Unknown"}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{followUp?.lead?.phone || "No phone"}</p>
                    {followUp?.lead?.source === "whatsapp" && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 border border-green-200 dark:border-green-700">
                        WhatsApp
                      </span>
                    )}
                  </div>
                  {followUp?.lead?.lastContacted && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Last contacted: {new Date(followUp.lead.lastContacted).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Follow-up type:</p>
                  <p className="text-xs font-medium">{followUp?.followUpType || "None"}</p>
                  {followUp?.lead?.interestedIn && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      <span className="font-medium">Interested In:</span> {followUp.lead.interestedIn}
                    </p>
                  )}
                </div>
              </div>
              {followUp?.notes && (
                <div className="mt-2 border-t border-gray-200 dark:border-gray-600 pt-2">
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Notes:</span> {followUp.notes}
                  </p>
                </div>
              )}
              {followUp?.lead?.company && (
                <div className="mt-1">
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Company:</span> {followUp.lead.company}
                  </p>
                </div>
              )}
            </div>
            
            <h4 className="font-medium text-sm mb-2">Select a Template:</h4>
            <div>
              {!followUp?.lead && !followUp.lead ? (
                <div className="p-8 text-center text-red-500 dark:text-red-400 text-xl font-light">
                  Unable to send WhatsApp message: Lead information is missing.
                </div>
              ) : loading ? (
                <Loading h={4} w={4} />
              ) : whatsappTemplates.length ? (
                <div className="space-y-2">
                  {whatsappTemplates.map((template) => (
                    <WhatsappTemplate
                      leadId={
                        typeof followUp.lead === "object"
                          ? followUp.lead._id
                          : followUp.lead
                      }
                      templateId={template._id}
                      key={template._id}
                      template={template}
                      setIsWhatsAppModalOpen={setIsWhatsAppModalOpen}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-xl font-light">
                  No templates found. Create a new template to get started.
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsWhatsAppModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md transform hover:scale-105 transition-transform duration-200"
                aria-label="Cancel WhatsApp template selection"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showCallLogModal && (
        <CallLogModal
          isOpen={showCallLogModal}
          onClose={() => setShowCallLogModal(false)}
          onSubmit={handleCallLogSubmit}
          leadName={followUp?.lead?.name || "Lead"}
        />
      )}
    </div>
  );
}

export default UpcommingFollowups;
