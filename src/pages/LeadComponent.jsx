import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaSearch,
  FaFilter,
  FaPlus,
  FaHistory,
  FaChartBar,
} from "react-icons/fa";
import leadService from "../services/leadService";
import followUpService from "../services/followupService";
import LeadCard from "../components/LeadCard";
import UpcommingFollowups from "../components/UpcommingFollowups";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { LeadSkeleton } from "../components";

const LeadComponent = () => {  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [todayFollowups, setTodayFollowups] = useState({ count: 0, followUps: [] });
  const [dueFollowups, setDueFollowups] = useState({ count: 0, followUps: [] });
  const [upcomingFollowups, setUpcomingFollowups] = useState({ count: 0, data: [] });
  const [activeTab, setActiveTab] = useState("today-followups");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddLead, setShowAddLead] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {      try {
        setLoading(true);
        const [leadResponse, todayResponse, overdueResponse, upcomingResponse] = await Promise.all([
          leadService.getUserLeads(),
          followUpService.getTodayFollowUps(),
          followUpService.getOverdueFollowUps(),
          followUpService.getUpcomingFollowUps(),
        ]);

        if (leadResponse.statusCode === 200) {
          setLeads(leadResponse.data);
        }
        if (todayResponse.statusCode === 200) {
          setTodayFollowups(todayResponse.data);
        }
        if (overdueResponse.statusCode === 200) {
          setDueFollowups(overdueResponse.data);
        }
        if (upcomingResponse.statusCode === 200) {
          setUpcomingFollowups(upcomingResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle adding a new lead
  const handleAddLead = async (data) => {
    try {
      const response = await leadService.createLead({
        ...data,
        status: "new",
        priority: "medium",
      });
      if (response.statusCode === 201) {
        setLeads([...leads, response.data]);
        setShowAddLead(false);
        reset();
        toast.success("Lead added successfully!");
      } else {
        throw new Error("Failed to add lead");
      }
    } catch (error) {
      toast.error(error.message || "Failed to add lead");
    }
  };

  // Filter leads by search term
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LeadSkeleton />;

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Header */}
      <header className="py-4 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shadow-sm">
        <h1 className="text-md md:text-2xl font-bold flex items-center">
          <FaUser className="mr-2 text-orange-500 dark:text-orange-400" />
          Lead Management
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAddLead(true)}
            className="flex items-center px-2 md:px-4 py-1 md:py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transform hover:scale-105 transition-transform duration-200"
            aria-label="Add new lead"
          >
            <FaPlus className="mr-2" />
            Add Lead
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 p-4 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="mb-6">
            <div className="relative bg-white dark:bg-gray-700 rounded-md shadow-sm mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search leads"
              />
            </div>

            <button
              className={`w-full flex items-center justify-between px-4 py-2 rounded-md mb-2 ${
                activeTab === "today-followups"
                  ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              } transition-colors duration-200`}
              onClick={() => setActiveTab("today-followups")}
            >
              <span>Today's Follow-ups</span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                {todayFollowups?.count || 0}
              </span>
            </button>            <button
              className={`w-full flex items-center justify-between px-4 py-2 rounded-md mb-2 ${
                activeTab === "overdue-followups"
                  ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              } transition-colors duration-200`}
              onClick={() => setActiveTab("overdue-followups")}
            >
              <span>Overdue Follow-ups</span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                {dueFollowups?.count || 0}
              </span>
            </button>
            <button
              className={`w-full flex items-center justify-between px-4 py-2 rounded-md mb-2 ${
                activeTab === "upcoming-followups"
                  ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              } transition-colors duration-200`}
              onClick={() => setActiveTab("upcoming-followups")}
            >
              <span>Upcoming Follow-ups</span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                {upcomingFollowups?.count || 0}
              </span>
            </button>
            <button
              className={`w-full flex items-center justify-between px-4 py-2 rounded-md mb-2 ${
                activeTab === "new"
                  ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              } transition-colors duration-200`}
              onClick={() => setActiveTab("new")}
            >
              <span>New Leads</span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                {filteredLeads.filter((l) => l.status === "new").length}
              </span>
            </button>
            <button
              className={`w-full flex items-center justify-between px-4 py-2 rounded-md mb-2 ${
                activeTab === "all"
                  ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              } transition-colors duration-200`}
              onClick={() => setActiveTab("all")}
            >
              <span>All Leads</span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                {filteredLeads.length}
              </span>
            </button>
          </div>

          <div>
            <h3 className="font-medium mb-2 flex items-center text-gray-700 dark:text-gray-300">
              <FaFilter className="mr-2" />
              Filters
            </h3>
            <select
              className="w-full p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Filter by status"
            >
              <option>All Statuses</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Proposal</option>
              <option>Negotiation</option>
              <option>Closed-Won</option>
              <option>Closed-Lost</option>
            </select>
            <select
              className="w-full p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 mt-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Filter by source"
            >
              <option>All Sources</option>
              <option>Website</option>
              <option>Referral</option>
              <option>Trade Show</option>
              <option>Social Media</option>
              <option>Email Campaign</option>
              <option>WhatsApp</option>
            </select>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-2 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <div className="p-2 md:p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {activeTab === "today-followups" && "Today's Follow-ups"}
                  {activeTab === "overdue-followups" && "Overdue Follow-ups"}
                  {activeTab === "upcoming-followups" && "Upcoming Follow-ups"}
                  {activeTab === "new" && "New Leads"}
                  {activeTab === "all" && "All Leads"}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    aria-label="View history"
                  >
                    <FaHistory />
                  </button>
                  <button
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    aria-label="View analytics"
                  >
                    <FaChartBar />
                  </button>                </div>
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
                {activeTab === "today-followups" ? (
                  todayFollowups.count !== 0 ? (
                    todayFollowups.followUps.map((followUp) => (
                      <UpcommingFollowups
                        activeTab={activeTab}
                        key={followUp._id}
                        followUp={followUp}
                        onUpdate={(updatedFollowUp) => {
                          if (updatedFollowUp) {
                            setTodayFollowups(prev => ({
                              ...prev,
                              followUps: prev.followUps.map(fu => 
                                fu._id === updatedFollowUp._id ? updatedFollowUp : fu
                              )
                            }));
                          } else {
                            // Refresh data if onUpdate is called with null (complete refresh signal)
                            fetchData();
                          }
                        }}
                      />
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-xl font-light">
                      No follow-ups today
                    </div>
                  )
                ) : activeTab === "overdue-followups" ? (
                  dueFollowups.count !== 0 ? (
                    dueFollowups.followUps.map((followUp) => (
                      <UpcommingFollowups
                        activeTab={activeTab}
                        key={followUp._id}
                        followUp={followUp}
                        onUpdate={(updatedFollowUp) => {
                          if (updatedFollowUp) {
                            setDueFollowups(prev => ({
                              ...prev,
                              followUps: prev.followUps.map(fu => 
                                fu._id === updatedFollowUp._id ? updatedFollowUp : fu
                              )
                            }));
                          } else {
                            // Refresh data if onUpdate is called with null
                            fetchData();
                          }
                        }}
                      />
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-xl font-light">
                      No overdue follow-ups
                    </div>
                  )
                ) : activeTab === "upcoming-followups" ? (
                  upcomingFollowups.count !== 0 ? (
                    upcomingFollowups.data.map((followUp) => (
                      <UpcommingFollowups
                        activeTab={activeTab}
                        key={followUp._id}
                        followUp={followUp}
                        onUpdate={(updatedFollowUp) => {
                          if (updatedFollowUp) {
                            setUpcomingFollowups(prev => ({
                              ...prev,
                              data: prev.data.map(fu => 
                                fu._id === updatedFollowUp._id ? updatedFollowUp : fu
                              )
                            }));
                          } else {
                            // Refresh data if onUpdate is called with null
                            fetchData();
                          }
                        }}
                      />
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-xl font-light">
                      No upcoming follow-ups
                    </div>
                  )
                ) : filteredLeads.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-xl font-light">
                    No leads found. Create a new lead to get started.
                  </div>
                ) : activeTab === "new" ? (
                  filteredLeads
                    .filter((lead) => lead.status === "new")
                    .map((lead) => <LeadCard key={lead._id} lead={lead} />)
                ) : (
                  filteredLeads.map((lead) => <LeadCard key={lead._id} lead={lead} />)
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Lead Modal */}
      {showAddLead && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md transform scale-95 animate-in">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Lead
            </h3>
            <form onSubmit={handleSubmit(handleAddLead)} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter lead name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register("phone", { required: "Phone is required" })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email (Optional)
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label
                  htmlFor="source"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Source (Optional)
                </label>
                <select
                  id="source"
                  {...register("source")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select source</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="trade show">Trade Show</option>
                  <option value="social media">Social Media</option>
                  <option value="email campaign">Email Campaign</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddLead(false)}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md transform hover:scale-105 transition-transform duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-md transform hover:scale-105 transition-transform duration-200"
                >
                  Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadComponent;