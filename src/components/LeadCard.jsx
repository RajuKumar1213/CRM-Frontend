import React, { useState, useEffect } from "react";
import {
  FaPhone,
  FaWhatsapp,
  FaCalendar,
  FaTag,
  FaClock,
  FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import whatsappService from "../services/whatsappService";
import followUpService from "../services/followupService";
import WhatsappTemplate from "./WhatsappTemplate";
import Loading from "./Loading";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

function LeadCard({ lead, onClick }) {
  const [whatsappTemplates, setWhatsappTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const statusColors = {
    new: "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200",
    contacted: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
    qualified: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200",
    negotiating: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200",
    'in-progress': "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200",
    'proposal-sent': "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200",
    won: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
    lost: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200",
    'on-hold': "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200",
  };

  const formatDate = (date) => {
    if (!date) return "Never";
    const d = new Date(date);
    return isNaN(d.getTime())
      ? "Invalid Date"
      : d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  const normalizedStatus = lead?.status?.toLowerCase() || "new";

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
  }, [isWhatsAppModalOpen]);

  // Handle scheduling a follow-up
  const handleScheduleCall = async (data) => {
    setIsSubmitting(true);
    try {
      // Set default time to 12:00 PM if not provided
      const timeValue = data.time || "12:00";
      const scheduledDate = new Date(
        `${data.date}T${timeValue}:00`
      ).toISOString();
      // Create follow-up data with correct status field
      const followUpData = {
        followUpType: "call", // Default to call type
        scheduled: scheduledDate,
        notes: data.notes || "",
        status: data.status, // Using status from the form
      };

      // First, try to get existing follow-ups for this lead
      let followUps = [];
      try {
        const followUpsResponse = await followUpService.getLeadFollowUps(
          lead._id
        );
        if (followUpsResponse.statusCode === 200) {
          followUps = followUpsResponse.data.followUps || [];
        }
      } catch (error) {
        console.error("Error fetching lead follow-ups:", error);
        // Continue with creating a new follow-up if we can't get existing ones
      }

      let response;
      // If the lead is not new and has existing follow-ups, update the latest one
      if (lead.status !== "new" && followUps.length > 0) {
        // Get the latest follow-up by checking scheduled date
        const latestFollowUp = followUps.reduce((latest, current) => {
          const currentDate = new Date(current.scheduled);
          const latestDate = new Date(latest.scheduled);
          return currentDate > latestDate ? current : latest;
        }, followUps[0]);

        // Update the latest follow-up
        response = await followUpService.updateFollowUp(
          latestFollowUp._id,
          followUpData
        );

        if (response.statusCode !== 200) {
          throw new Error("Failed to reschedule follow-up");
        }
        toast.success("Follow-up rescheduled successfully!");
      } else {
        // If no existing follow-ups or it's a new lead, create a new one
        response = await followUpService.createFollowUp(lead._id, followUpData);

        if (response.statusCode !== 201) {
          throw new Error("Failed to schedule follow-up");
        }
        toast.success("Follow-up scheduled successfully!");
      }

      setIsScheduleModalOpen(false);
      reset();
    } catch (error) {
      console.error("Error scheduling follow-up:", error);
      toast.error(error.message || "Failed to schedule follow-up");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg ${
        onClick ? "bg-orange-50 dark:bg-orange-900/30" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <Link
            to={`/leads/${lead._id}`}
            className="text-sm font-semibold text-gray-900 dark:text-white hover:underline"
          >
            {lead?.name || "Unknown Lead"}
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              statusColors[normalizedStatus] || statusColors.new
            } capitalize`}
          >
            {lead?.status || "New"}
          </span>
          <Link to={`/leads/detail/${lead._id}`}>
            <button
              className="p-1 text-xs text-orange-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
              aria-label="View lead details"
            >
              View details
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <div className="flex items-center">
          <FaPhone className="mr-2 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">
            {lead?.phone || "No Phone"}
          </span>
        </div>
        <div className="flex items-center">
          <FaEnvelope className="mr-2 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">
            {lead?.email || "No Email"}
          </span>
        </div>
        <div className="flex items-center">
          <FaClock className="mr-2 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">
            Last Contact: {formatDate(lead?.lastContacted)}
          </span>
        </div>
        <div className="flex items-center">
          <FaTag className="mr-2 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">
            Source: {lead?.source || "Unknown"}
          </span>
        </div>
      </div>
      {lead?.followUps?.length > 0 && (
        <div className="mt-2 flex items-center text-sm">
          <FaClock className="mr-2 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">
            {lead.followUps.filter((fu) => !fu.completed).length} pending
            follow-ups
          </span>
        </div>
      )}
      <div className="mt-3 flex flex-wrap space-x-2">
        {lead?.phone && (
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center px-3 py-1 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md transform hover:scale-105 transition-transform duration-200"
            aria-label={`Call ${lead.name}`}
          >
            <FaPhone className="mr-1" />
            Call
          </a>
        )}
        {lead?.phone && (
          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="flex items-center px-3 py-1 text-xs font-medium text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 rounded-md transform hover:scale-105 transition-transform duration-200"
            aria-label={`Message ${lead.name} on WhatsApp`}
          >
            <FaWhatsapp className="mr-1" />
            WhatsApp
          </button>
        )}
        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="flex items-center px-3 py-1 text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 rounded-md transform hover:scale-105 transition-transform duration-200"
          aria-label={`${
            lead.status === "new" ? "Schedule" : "Reschedule"
          } follow-up for ${lead.name}`}
        >
          <FaCalendar className="mr-1" />
          {lead.status === "new" ? "Schedule" : "Reschedule"}
        </button>
      </div>

      {/* WhatsApp Modal */}
      {isWhatsAppModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto transform scale-95 animate-in">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select a Template to Send to {lead?.name}
            </h3>
            <div>
              {loading ? (
                <Loading h={4} w={4} />
              ) : whatsappTemplates.length ? (
                whatsappTemplates.map((template) => (
                  <WhatsappTemplate
                    leadId={lead._id}
                    key={template._id}
                    template={template}
                    setIsWhatsAppModalOpen={setIsWhatsAppModalOpen}
                  />
                ))
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

      {/* Schedule Call Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md transform scale-95 animate-in">
            {" "}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {lead.status === "new" ? "Schedule" : "Reschedule"} Follow-Up for{" "}
              {lead?.name}
            </h3>
            <form
              onSubmit={handleSubmit(handleScheduleCall)}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="date"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  {...register("date", { required: "Date is required" })}
                  className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label="Follow-up date"
                />
                {errors.date && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.date.message}
                  </p>
                )}
              </div>{" "}
              <div>
                <label
                  htmlFor="time"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Time (Optional)
                </label>
                <input
                  type="time"
                  id="time"
                  {...register("time")}
                  className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label="Follow-up time"
                />{" "}
              </div>{" "}
              <div>
                <label
                  htmlFor="status"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Status
                </label>
                <select
                  id="status"
                  {...register("status", { required: "Status is required" })}
                  className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label="Follow-up status"
                  defaultValue="pending"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="rescheduled">Rescheduled</option>
                  <option value="missed">Missed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {errors.status && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {errors.status.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="notes"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  {...register("notes")}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter notes for the follow-up..."
                  rows={2}
                  aria-label="Follow-up notes"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-3 py-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md transform hover:scale-105 transition-transform duration-200"
                  aria-label="Cancel scheduling"
                >
                  Cancel
                </button>{" "}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1 text-xs text-white bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 rounded-md transform hover:scale-105 transition-transform duration-200 disabled:opacity-50"
                  aria-label={`${
                    lead.status === "new" ? "Schedule" : "Reschedule"
                  } follow-up`}
                >
                  {isSubmitting
                    ? lead.status === "new"
                      ? "Scheduling..."
                      : "Rescheduling..."
                    : lead.status === "new"
                    ? "Schedule"
                    : "Reschedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeadCard;
