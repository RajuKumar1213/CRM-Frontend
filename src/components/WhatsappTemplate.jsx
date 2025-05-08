import React, { useEffect, useState } from "react";
import whatsappService from "../services/whatsappService";
import toast from "react-hot-toast";
import Loading from "./Loading";




function WhatsappTemplate({template, leadId ,                     setIsWhatsAppModalOpen={setIsWhatsAppModalOpen}
}) {
    const [loading , setLoading] = useState(false);
    
    const handleSendWhatsApp = ()=> {
        setLoading(true)
        whatsappService.sendWhatsappMessage(template?._id, leadId).then((res)=> {
            if(res.statusCode === 200) {
                toast.success("WhatsApp message sent successfully!")
                setLoading(false)
                setIsWhatsAppModalOpen(false)
            }
         }).catch((error) => {
            toast.error(error.message)
            setLoading(false)
         }).finally(()=> {
            setLoading(false)
         })
    }

  return (
    <div className="w-full p-4 my-2 bg-white dark:hover:bg-gray-700 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
  <div className="mb-6">
    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
      {template?.name}
    </h4>
    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
      {template?.content}
    </p>
  </div>
  <div className="flex justify-end space-x-3">
    <button
      onClick={handleSendWhatsApp}
      className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex justify-center items-center cursor-pointer"
    >
      {loading && <Loading h={4} w={4}/>} {loading ? "Sending..." : "Send Whatsapp"}
    </button>
  </div>
</div>
  );
}

export default WhatsappTemplate;
