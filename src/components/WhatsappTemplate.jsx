import React, { useEffect, useState } from "react";
import whatsappService from "../services/whatsappService";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { FaWhatsapp } from "react-icons/fa";

function WhatsappTemplate({
  template,
  leadId,
  setIsWhatsAppModalOpen,
}) {
  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState(null);

  // Get lead data for better placeholder replacement
  useEffect(() => {
    if (leadId) {
      // This is a limited implementation - in a real scenario, you'd fetch the lead data
      // For now, we'll just log the leadId
      console.log("WhatsappTemplate for lead:", leadId);
    }
  }, [leadId]);

  const handleSendWhatsApp = () => {
    setLoading(true);
    whatsappService
      .sendWhatsappMessage(template?._id, leadId)
      .then((res) => {
        if (res.statusCode === 200) {
          toast.success("WhatsApp message sent successfully!");
          setLoading(false);
          setIsWhatsAppModalOpen(false);
        }
      })
      .catch((error) => {
        toast.error(error.message || "Failed to send WhatsApp message");
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full p-4 my-2 bg-white dark:hover:bg-gray-700 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
          <span>{template?.name}</span>
          {template?.isActive && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 font-medium">Active</span>
          )}
        </h4>
        <span className="text-xs text-gray-500 dark:text-gray-400">Used {template?.usageCount || 0}x</span>
      </div>
      {template?.description && (
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 italic">{template.description}</p>
      )}
      <div className="mb-3 p-3 rounded bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-700">
        <span className="block text-sm text-gray-800 dark:text-gray-100 whitespace-pre-line">{template?.content}</span>
      </div>
      {template?.tags && template.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {template.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-xs rounded bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200 font-medium">#{tag}</span>
          ))}
        </div>
      )}      <div className="flex justify-end space-x-3 mt-2">
        <button
          onClick={handleSendWhatsApp}
          className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex justify-center items-center cursor-pointer"
        >
          {loading ? (
            <><Loading h={4} w={4} /> <span className="ml-2">Sending...</span></>
          ) : (
            <><FaWhatsapp className="mr-2" /> Send WhatsApp</>
          )}
        </button>
      </div>
    </div>
  );
}

export default WhatsappTemplate;
