import React, { useState } from "react";
import { FaPhone, FaCalendar, FaCheck } from "react-icons/fa";
import { FaNoteSticky } from 'react-icons/fa6';

import { format } from "date-fns";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import followUpService from "../services/followupService";
import { useForm } from "react-hook-form";

function UpcommingFollowups({ followUp, activeTab, onUpdate }) {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Handle marking follow-up as completed
  const handleComplete = async () => {
    if (followUp.status === "completed") return;

    setIsSubmitting(true);
    const originalStatus = followUp.status;

    // Optimistic update
    onUpdate?.({ ...followUp, status: "completed" });

    try {
      const response = await followUpService.updateFollowUp(followUp._id, {
        status: "completed",
      });
      if (response.statusCode !== 200) {
        throw new Error("Failed to update follow-up");
      }
      toast.success("Follow-up marked as completed!");
    } catch (error) {
      onUpdate?.({ ...followUp, status: originalStatus });
      toast.error(error.message || "Failed to complete follow-up");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle adding a note
  const handleAddNote = async (data) => {
    setIsSubmitting(true);
    const originalNotes = followUp.notes;

    // Optimistic update
    onUpdate?.({ ...followUp, notes: data.notes });

    try {
      const response = await followUpService.updateFollowUp(followUp._id, {
        notes: data.notes,
      });
      if (response.statusCode !== 200) {
        throw new Error("Failed to add note");
      }
      toast.success("Note added successfully!");
      setShowNoteForm(false);
      reset();
    } catch (error) {
      onUpdate?.({ ...followUp, notes: originalNotes });
      toast.error(error.message || "Failed to add note");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle rescheduling a follow-up
  const handleReschedule = async (data) => {
    setIsSubmitting(true);

    try {
      const scheduledDate = new Date(`${data.date}T${data.time}:00`).toISOString();
      const response = await followUpService.scheduleFollowUp({
        leadId: followUp.lead._id,
        followUpType: data.followUpType,
        scheduled: scheduledDate,
        notes: data.notes || "",
      });
      if (response.statusCode !== 201) {
        throw new Error("Failed to schedule follow-up");
      }
      toast.success("Follow-up rescheduled successfully!");
      setShowRescheduleForm(false);
      reset();
      // Optionally refresh follow-ups in parent component
      onUpdate?.(null); // Signal parent to refresh
    } catch (error) {
      toast.error(error.message || "Failed to reschedule follow-up");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg">
      <div className="flex items-start">
        <div
          className={`flex-shrink-0 p-3 rounded-lg mr-4 ${
            followUp?.followUpType === "call"
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-500"
              : "bg-purple-100 dark:bg-purple-900/30 text-purple-500"
          }`}
        >
          <FaPhone size={18} />
        </div>
        <div className="flex-1">
          <Link
            to={`/leads/${followUp?.lead?._id}`}
            className="text-sm font-semibold text-gray-900 dark:text-white hover:underline"
          >
            {followUp?.lead?.name || "Unknown Lead"}
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Type: {followUp?.followUpType}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Scheduled: {format(new Date(followUp?.scheduled), "MMM d, yyyy 'at' h:mm a")}
          </p>
          {followUp?.notes && (
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
              Notes: {followUp.notes}
            </p>
          )}
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded ml-4 self-center ${
            followUp?.status === "pending"
              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
              : followUp?.status === "completed"
              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
          }`}
        >
          {followUp?.status}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 flex space-x-2">
        {followUp?.status !== "completed" && (
          <button
            onClick={handleComplete}
            disabled={isSubmitting}
            className="flex items-center px-3 py-1 text-xs font-medium text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 rounded-md transform hover:scale-105 transition-transform duration-200 disabled:opacity-50"
            aria-label="Mark follow-up as completed"
          >
            <FaCheck className="mr-1" />
            Complete
          </button>
        )}
        <button
          onClick={() => setShowNoteForm(!showNoteForm)}
          className="flex items-center px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md transform hover:scale-105 transition-transform duration-200"
          aria-label="Add or edit note"
        >
          <FaNoteSticky className="mr-1" />
          {followUp?.notes ? "Edit Note" : "Add Note"}
        </button>
        <button
          onClick={() => setShowRescheduleForm(!showRescheduleForm)}
          className="flex items-center px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md transform hover:scale-105 transition-transform duration-200"
          aria-label="Reschedule follow-up"
        >
          <FaCalendar className="mr-1" />
          Reschedule
        </button>
        {followUp?.lead?.phone && (
          <a
            href={`tel:${followUp.lead.phone}`}
            className="flex items-center px-3 py-1 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md transform hover:scale-105 transition-transform duration-200"
            aria-label={`Call ${followUp.lead.name}`}
          >
            <FaPhone className="mr-1" />
            Call
          </a>
        )}
      </div>

      {/* Note Form */}
      {showNoteForm && (
        <form onSubmit={handleSubmit(handleAddNote)} className="mt-3 space-y-2">
          <textarea
            {...register("notes", { required: "Note is required" })}
            defaultValue={followUp?.notes || ""}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter follow-up notes..."
            rows={3}
            aria-label="Follow-up notes"
          />
          {errors.notes && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {errors.notes.message}
            </p>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowNoteForm(false)}
              className="px-3 py-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md"
              aria-label="Cancel note"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1 text-xs text-white bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 rounded-md disabled:opacity-50"
              aria-label="Save note"
            >
              Save Note
            </button>
          </div>
        </form>
      )}

      {/* Reschedule Form */}
      {showRescheduleForm && (
        <form onSubmit={handleSubmit(handleReschedule)} className="mt-3 space-y-2">
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
              Time
            </label>
            <input
              type="time"
              id="time"
              {...register("time", { required: "Time is required" })}
              className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Follow-up time"
            />
            {errors.time && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {errors.time.message}
              </p>
            )}
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
              className="px-3 py-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md"
              aria-label="Cancel reschedule"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1 text-xs text-white bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 rounded-md disabled:opacity-50"
              aria-label="Schedule new follow-up"
            >
              Schedule
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default UpcommingFollowups;