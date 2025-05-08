import React, { useState, useEffect } from "react";
import {
  FaClock,
  FaEllipsisV,
  FaEnvelope,
  FaPhone,
  FaPhoneAlt,
  FaPhoneSlash,
  FaTag,
  FaWhatsapp,
} from "react-icons/fa";
import whatsappService from "../services/whatsappService";
import WhatsappTemplate from "./WhatsappTemplate";
import Loading from "./Loading";

function LeadCard({ lead, onClick, activeTab }) {
  const [whatsappTemplates, setWhatsappTemplates] = useState([]);

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

  // State for Vonage call
  const [callStatus, setCallStatus] = useState("idle");
  const [vonageClient, setVonageClient] = useState(null);
  const [callInstance, setCallInstance] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for WhatsApp modal
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  // Format last contacted date
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

  // Normalize status for color lookup
  const normalizedStatus = lead?.status?.toLowerCase() || "new";

  // Handle WhatsApp button click
  const handleWhatsAppClick = () => {
    setIsWhatsAppModalOpen(true);
  };

  useEffect(() => {
    whatsappService
      .getWhatsappTemplates()
      .then((response) => {
        if (response.statusCode === 200) {
          setWhatsappTemplates(response.data);
          setLoading(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div
      className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
        onClick ? "bg-orange-50 dark:bg-orange-900/30" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {lead?.name || "Unknown Lead"}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              statusColors[normalizedStatus] || statusColors.new
            } capitalize`}
          >
            {lead?.status || "New"}
          </span>
          <button className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
            <FaEllipsisV className="text-sm text-gray-500 dark:text-gray-400" />
          </button>
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
          className="flex items-center px-3 py-1 rounded-md text-sm bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <FaWhatsapp className="mr-2" />
          WhatsApp
        </button>
        {error && (
          <span className="text-sm text-red-500 dark:text-red-400">
            {error}
          </span>
        )}
      </div>

      {/* WhatsApp Modal */}
      {isWhatsAppModalOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white overflow-y-scroll h-2/3   dark:bg-gray-800 rounded-lg p-6 w-full max-w-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select a Template to send message to {lead?.name} 
            </h3>
            <div className="">
              {loading ? (
                <Loading />
              ) : whatsappTemplates ? (
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
                  No templates found. Create a new lead to get started.
                </div>
              )}
              <button
                onClick={() => setIsWhatsAppModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-red-600 hover:bg-red-500 dark:hover:bg-red-700 rounded-md cursor-pointer"
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

export default LeadCard;
