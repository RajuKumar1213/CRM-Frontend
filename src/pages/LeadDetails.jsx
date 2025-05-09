import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaTag,
  FaClock,
  FaArrowLeft,
  FaWhatsapp,
  FaInfoCircle,
  FaCalendarAlt,
  FaUserTie
} from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import leadService from "../services/leadService";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Loading, Skeleton } from "../components";

function LeadDetails() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const [leadData, setLeadData] = useState({
    lead: null,
    followUps: [],
    activities: []
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [leadUpdate, setLeadUpdate] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await leadService.getLead(leadId);
        if (response.statusCode === 200) {
          setLeadData(response.data);
          // Set form values if editing
          setValue("name", response.data.lead.name);
          setValue("email", response.data.lead.email);
          setValue("phone", response.data.lead.phone);
          setValue("status", response.data.lead.status);
          setValue("priority", response.data.lead.priority);
          setValue("source", response.data.lead.source);
          setValue("notes", response.data.lead.notes);
          setValue("product", response.data.lead.product);
        }
      } catch (error) {
        console.error("Error fetching lead:", error);
        toast.error("Failed to load lead details");
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [leadId, setValue, leadUpdate]);

  const handleUpdateLead = async (data) => {
    try {
    setLoading(true)
      const response = await leadService.updateLead(leadId, data);
      if (response.statusCode === 200) {
        setLeadData(prev => ({
          ...prev,
          lead: response.data.lead
        }));
        setIsEditing(false);
        toast.success("Lead updated successfully!");
        setLoading(false)
        setLeadUpdate(true)
      } else {
        throw new Error(response.message || "Failed to update lead");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update lead");
      setLoading(false)
      setLeadData(false)
    }
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
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-purple-100 text-purple-800";
      case "qualified":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  const { lead, followUps, activities } = leadData;
  if(loading) return <Skeleton/>

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <FaArrowLeft />
            <span>Back to Leads</span>
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              isEditing
                ? "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isEditing ? "Cancel Editing" : "Edit Lead"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Lead Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {lead?.name}
                </h2>
                <div className="flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead?.status)}`}>
                    {lead?.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead?.priority)}`}>
                    {lead?.priority}
                  </span>
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit(handleUpdateLead)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        {...register("phone", { required: "Phone is required" })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Product
                      </label>
                      <input
                        type="text"
                        {...register("product")}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        {...register("status", { required: "Status is required" })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="proposal">Proposal</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="closed-won">Closed-Won</option>
                        <option value="closed-lost">Closed-Lost</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Priority
                      </label>
                      <select
                        {...register("priority", { required: "Priority is required" })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Source
                      </label>
                      <select
                        {...register("source")}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="website">Website</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="phone">Phone</option>
                        <option value="email">Email</option>
                        <option value="referral">Referral</option>
                        <option value="other">Other</option>
                      </select>
                    </div> */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Notes
                      </label>
                      <textarea
                        {...register("notes")}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                      {loading && <Loading h={4} w={4} />} Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400 mt-1">
                        <FaPhone />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-sm text-gray-900 dark:text-white">{lead?.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400 mt-1">
                        <FaEnvelope />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-sm text-gray-900 dark:text-white">{lead?.email || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400 mt-1">
                        <FaTag />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Product</p>
                        <p className="text-sm text-gray-900 dark:text-white">{lead?.product || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400 mt-1">
                        {lead?.source === "whatsapp" ? <FaWhatsapp /> : <FaInfoCircle />}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Source</p>
                        <p className="?text-sm text-gray-900 dark:text-white capitalize">{lead?.source || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400 mt-1">
                        <FaUserTie />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned To</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {lead?.assignedTo?.name || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400 mt-1">
                        <FaClock />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Contacted</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {formatDate(lead?.lastContacted)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Notes</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {lead?.notes || "No notes available"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Follow Ups Section */}
            {followUps.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Follow Ups</h3>
                <ul className="space-y-4">
                  {followUps.map((followUp) => (
                    <li key={followUp._id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {followUp.followUpType === "call" ? "Phone Call" : "Follow Up"} scheduled
                          </p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <FaCalendarAlt className="mr-2" />
                            <span>{formatDate(followUp.scheduled)}</span>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FaUserTie className="mr-2" />
                        <span>Assigned to {followUp.assignedTo.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Lead Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formatDate(lead?.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formatDate(lead?.updatedAt)}
                  </p>
                </div>
                {lead?.contactedWith && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contacted Via</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {lead?.contactedWith.startsWith("+91") ? "WhatsApp" : "Phone"}: {lead?.contactedWith}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Activity Timeline</h3>
              {activities.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {activities.map((activity, activityIdx) => (
                      <li key={activity._id}>
                        <div className="relative pb-8">
                          {activityIdx !== activities.length - 1 ? (
                            <span
                              className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-600"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span
                                className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${
                                  activity.type === "created"
                                    ? "bg-blue-500 text-white"
                                    : "bg-green-500 text-white"
                                }`}
                              >
                                {activity.type === "created" ? (
                                  <FaUser className="h-5 w-5" />
                                ) : (
                                  <IoMdTime className="h-5 w-5" />
                                )}
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-800 dark:text-gray-200">
                                  {activity.type === "created" ? "Lead created" : "Follow up completed"}
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                                <time dateTime={activity.createdAt}>
                                  {formatDate(activity.createdAt)}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400">No activities yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadDetails;