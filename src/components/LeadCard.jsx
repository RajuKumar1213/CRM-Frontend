import React, { useState, useEffect } from "react";
import {
  FaClock,
  FaEllipsisV,
  FaEnvelope,
  FaPhone,
  FaPhoneAlt,
  FaCalendarAlt,
  FaWhatsapp,
  FaTag,
  FaCross,
  FaCut,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import whatsappService from "../services/whatsappService";
import leadService from "../services/leadService";
import WhatsappTemplate from "./WhatsappTemplate";
import Loading from "./Loading";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import Button from "./Button";

function LeadCard({ lead, onClick, activeTab }) {
  const [whatsappTemplates, setWhatsappTemplates] = useState([]);
  const [callStatus, setCallStatus] = useState("idle");
  const [vonageClient, setVonageClient] = useState(null);
  const [callInstance, setCallInstance] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const statusColors = {
    new: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    contacted:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    qualified:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    proposal: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    negotiation:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    "closed-won":
      "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
    "closed-lost": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
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

  const handleWhatsAppClick = () => {
    setIsWhatsAppModalOpen(true);
  };

  const handleScheduleCall = async (data) => {
    try {
      const followUpData = {
        leadId: lead._id,
        scheduledDate: data.scheduledDate,
        notes: data.notes || "",
      };
      const response = await leadService.scheduleFollowUp(followUpData);
      if (response.statusCode === 200) {
        toast.success("Follow-up scheduled successfully!");
        setIsScheduleModalOpen(false);
        reset();
      } else {
        throw new Error("Failed to schedule follow-up");
      }
    } catch (error) {
      toast.error(error.message || "Failed to schedule follow-up");
    }
  };

  useEffect(() => {
    whatsappService
      .getWhatsappTemplates()
      .then((response) => {
        if (response.statusCode === 200) {
          setWhatsappTemplates(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching WhatsApp templates:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div
      className={`p-4 border-b border-gray-200 dark:border-gray-700  hover:bg-gray-50 dark:hover:bg-gray-700 ${
        onClick ? "bg-orange-50 dark:bg-orange-900/30" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <Link to={`/leads/${lead._id}`} className="hover:underline">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {lead?.name || "Unknown Lead"}
            </h3>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`text-xs px-2 py-1 rounded-md ${
              statusColors[normalizedStatus] || statusColors.new
            } capitalize`}
          >
            {lead?.status || "New"}
          </span>
          <Link to={`detail/${lead._id}`}>
            <button className="p-1 cursor-pointer text-xs rounded-md text-orange-500 hover:bg-gray-200 dark:hover:bg-gray-600">
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
        <div className="mt-3 flex items-center text-sm">
          <FaClock className="mr-2 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">
            {lead.followUps.filter((fu) => !fu.completed).length} pending
            follow-ups
          </span>
        </div>
      )}
      <div className="mt-3 flex items-center space-x-2">
        <div className="flex flex-wrap space-x-1">
          <button
            className={`flex items-center px-3 py-1 rounded-md text-sm ${
              callStatus === "connected"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-orange-500 hover:bg-orange-600"
            } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <FaPhoneAlt className="mr-2" />
            {callStatus === "connecting"
              ? "Connecting..."
              : callStatus === "connected"
              ? "End Call"
              : "Call Lead"}
          </button>
          <button
            onClick={handleWhatsAppClick}
            disabled={!lead?.phone}
            className="flex items-center px-3 py-1 rounded-md text-sm bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaWhatsapp className="mr-2" />
            WhatsApp
          </button>
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            disabled={!lead?.phone}
            className="flex items-center px-3 py-1 rounded-md text-sm bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaCalendarAlt className="mr-2" />
            Schedule Call
          </button>
        </div>

        {error && (
          <span className="text-sm text-red-500 dark:text-red-400">
            {error}
          </span>
        )}
      </div>

      {/* WhatsApp Modal */}
      {isWhatsAppModalOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg m-2 p-4 w-full max-w-xl overflow-y-auto max-h-[80vh]">
            <button
              onClick={() => setIsWhatsAppModalOpen(false)}
              className=" mb-2 flex items-center justify-center gap-x-2 text-orange-500 cursor-pointer"
            >
              <FaArrowLeft /> Back
            </button>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select a Template to send message to {lead?.name}
            </h3>
            <div>
              {loading ? (
                <Loading />
              ) : whatsappTemplates?.templates?.length ? (
                whatsappTemplates.templates.map((template) => (
                  <WhatsappTemplate
                    leadId={lead._id}
                    key={template._id}
                    template={template}
                    setIsWhatsAppModalOpen={setIsWhatsAppModalOpen}
                  />
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No templates found. Create a new template to get started.
                </div>
              )}
              <button
                onClick={() => setIsWhatsAppModalOpen(false)}
                className="mt-4 px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Call Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Schedule Follow-Up Call for {lead?.name}
            </h3>
            <form
              onSubmit={handleSubmit(handleScheduleCall)}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="scheduledDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Date and Time
                </label>
                <input
                  type="datetime-local"
                  id="scheduledDate"
                  {...register("scheduledDate", {
                    required: "Date and time are required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.scheduledDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.scheduledDate.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  {...register("notes")}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any notes for the follow-up..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                >
                  Schedule
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
