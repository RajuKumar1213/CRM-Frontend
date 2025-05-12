import React, { useState, useEffect } from "react";
import { FaPhone, FaCalendar, FaCheck, FaWhatsapp } from "react-icons/fa";

import { format } from "date-fns";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import followUpService from "../services/followupService";
import whatsappService from "../services/whatsappService";
import WhatsappTemplate from "./WhatsappTemplate";
import Loading from "./Loading";
import { useForm } from "react-hook-form";

function UpcommingFollowups({ followUp, onSuccess }) {
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsappTemplates, setWhatsappTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Log prop and state for debugging

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
      const response = await followUpService.updateFollowUp(followUp._id, {
        followUpType: data.followUpType,
        scheduled: scheduledDate,
        notes: data.notes || "",
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

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg">
      <div className="flex items-start">
        <div
          className={`flex-shrink-0 p-3 rounded-lg mr-4 flex items-center justify-center w-10 h-10 ${
            followUp?.followUpType === "call"
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-500"
              : "bg-purple-100 dark:bg-purple-900/30 text-purple-500"
          }`}
        >
          {followUp?.lead?.name ? (
            <span className="text-sm font-bold">
              {followUp.lead.name
                .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)\s+/i, "")
                .trim()
                .charAt(0)
                .toUpperCase()}
            </span>
          ) : (
            <FaPhone size={10} />
          )}
        </div>
        <div className="flex-1">
          {followUp?.lead?.name || "Unknown Lead"}

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Type: {followUp?.followUpType}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Scheduled:{" "}
            {format(new Date(followUp?.scheduled), "MMM d, yyyy 'at' h:mm a")}
          </p>
          {followUp?.notes && (
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
              Notes: {followUp.notes}
            </p>
          )}
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded ml-4 self-center ${
            followUp?.status === "won"
              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
              : followUp?.status === "lost"
              ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
              : followUp?.status === "in-progress"
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
              : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
          }`}
        >
          {followUp?.status}
        </span>
      </div>{" "}
      {/* Action Buttons */}
      <div className="mt-3 flex space-x-2">
        {" "}
        {followUp?.lead?.phone && (
          <>
            <a
              href={`tel:${followUp.lead.phone}`}
              className="flex items-center px-3 py-1 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md transform hover:scale-105 transition-transform duration-200"
              aria-label={`Call ${followUp.lead.name}`}
            >
              <FaPhone className="mr-1" />
              Call
            </a>
            <button
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="flex items-center px-3 py-1 text-xs font-medium text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 rounded-md transform hover:scale-105 transition-transform duration-200"
              aria-label={`Message ${followUp.lead.name} on WhatsApp`}
            >
              <FaWhatsapp className="mr-1" />
              WhatsApp
            </button>
          </>
        )}
        <button
          onClick={() => setShowRescheduleForm(!showRescheduleForm)}
          className="flex items-center px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md transform hover:scale-105 transition-transform duration-200"
          aria-label="Reschedule follow-up"
        >
          <FaCalendar className="mr-1" />
          Reschedule
        </button>
        {!(followUp?.status === "won" || followUp?.status === "lost") && (
          <>
            <button
              onClick={async () => {
                setIsFormSubmitting(true);
                try {
                  const response = await followUpService.updateFollowUp(followUp._id, { status: "won" });
                  if (response.statusCode !== 200) throw new Error("Failed to update follow-up");
                  toast.success("Follow-up marked as Won!");
                  onSuccess();
                } catch (error) {
                  toast.error(error.message || "Failed to mark as won");
                } finally {
                  setIsFormSubmitting(false);
                }
              }}
              disabled={isFormSubmitting}
              className="flex items-center px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transform hover:scale-105 transition-transform duration-200 disabled:opacity-50"
              aria-label="Mark follow-up as won"
            >
              <FaCheck className="mr-1" />
              Mark as Won
            </button>
            <button
              onClick={async () => {
                setIsFormSubmitting(true);
                try {
                  const response = await followUpService.updateFollowUp(followUp._id, { status: "lost" });
                  if (response.statusCode !== 200) throw new Error("Failed to update follow-up");
                  toast.success("Follow-up marked as Lost!");
                  onSuccess();
                } catch (error) {
                  toast.error(error.message || "Failed to mark as lost");
                } finally {
                  setIsFormSubmitting(false);
                }
              }}
              disabled={isFormSubmitting}
              className="flex items-center px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transform hover:scale-105 transition-transform duration-200 disabled:opacity-50"
              aria-label="Mark follow-up as lost"
            >
              <FaCheck className="mr-1" />
              Mark as Lost
            </button>
          </>
        )}
      </div>
      {/* Reschedule Form */}
      {showRescheduleForm && (
        <form
          onSubmit={handleSubmit(handleReschedule)}
          className="mt-3 space-y-2"
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
          </div>
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
            />
          </div>
          <div>
            <label
              htmlFor="followUpType"
              className="block text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              Type
            </label>
            <select
              id="followUpType"
              {...register("followUpType", { required: "Type is required" })}
              className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Follow-up type"
            >
              <option value="call">Call</option>
              <option value="email">Email</option>
              <option value="meeting">Meeting</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
            {errors.followUpType && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {errors.followUpType.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="rescheduleNotes"
              className="block text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              Notes (Optional)
            </label>
            <textarea
              id="rescheduleNotes"
              {...register("notes")}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter notes for new follow-up..."
              rows={2}
              aria-label="Reschedule notes"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowRescheduleForm(false)}
              className="px-3 py-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md transform hover:scale-105 transition-transform duration-200"
              aria-label="Cancel reschedule"
            >
              Cancel
            </button>{" "}
            <button
              type="submit"
              disabled={isFormSubmitting}
              className="px-3 py-1 text-xs text-white bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 rounded-md transform hover:scale-105 transition-transform duration-200 disabled:opacity-50"
              aria-label="Schedule new follow-up"
            >
              {isFormSubmitting ? "Scheduling..." : "Schedule"}
            </button>
          </div>
        </form>
      )}
      {/* WhatsApp Modal */}
      {isWhatsAppModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto transform scale-95 animate-in">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select a Template to Send to {followUp?.lead?.name}
            </h3>
            <div>
              {loading ? (
                <Loading h={4} w={4} />
              ) : whatsappTemplates.length ? (
                whatsappTemplates.map((template) => (
                  <WhatsappTemplate
                    leadId={followUp.lead._id}
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
    </div>
  );
}

export default UpcommingFollowups;
