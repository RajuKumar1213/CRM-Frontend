import React, { useEffect, useState, useCallback } from "react";
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
import { LEAD_STATUSES } from '../utils/constants';
import { useSelector } from 'react-redux';

const LeadComponent = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');
  const [dueFollowups, setDueFollowups] = useState({ count: 0, followUps: [] });
  const [todayFollowups, setTodayFollowups] = useState({ count: 0, followUps: [] });
  const [upcomingFollowups, setUpcomingFollowups] = useState({ count: 0, data: [] });
  const { userData } = useSelector((state) => state.auth);
  const isAdmin = userData?.role === 'admin';
  const [showAddLead, setShowAddLead] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();  // Function to fetch leads with current filters
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      
      // Use getLeads for admin and getUserLeads for employees
      if (isAdmin) {
        response = await leadService.getLeads({
          search: activeSearchQuery,
          status: statusFilter,
          source: sourceFilter,
          priority: priorityFilter
        });
      } else {
        response = await leadService.getUserLeads({
          search: activeSearchQuery,
          status: statusFilter,
          source: sourceFilter,
          priority: priorityFilter
        });
      }

      console.log('Fetch leads response:', response);
      
      if (response.data) {
        console.log('Setting leads:', response.data);
        setLeads(response.data);
      } else {
        console.log('No leads data in response, setting empty array');
        setLeads([]); // Set empty array if no leads exist
      }
      
      console.log('Active tab:', activeTab);

      // Set followups data
      if (response?.data?.followUps) {
        const { overdue, today, upcoming } = response.data.followUps;
        setDueFollowups(overdue || { count: 0, followUps: [] });
        setTodayFollowups(today || { count: 0, followUps: [] });
        setUpcomingFollowups(upcoming || { count: 0, data: [] });
      }
      
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch leads');
      toast.error(err.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
      setTriggerFetch(false);
    }
  }, [isAdmin, activeSearchQuery, statusFilter, sourceFilter, priorityFilter]);
    // Fetch all data on mount or when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [todayResponse, overdueResponse, upcomingResponse] =
          await Promise.all([
            followUpService.getTodayFollowUps(),
            followUpService.getOverdueFollowUps(),
            followUpService.getUpcomingFollowUps(),
          ]);
        
        // Fetch leads with current filters
        await fetchLeads();

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
        setTriggerFetch(false);
      }
    };
    fetchData();
  }, [triggerFetch, fetchLeads]);
  
  // Run fetchLeads whenever activeSearchQuery changes
  useEffect(() => {
    if (activeSearchQuery !== "") {
      fetchLeads();
    }
  }, [activeSearchQuery, fetchLeads]);

  const handleChildSuccess = () => {
    setTriggerFetch(true);
  };

  // Handle adding a new lead
  const handleAddLead = async (data) => {
    try {
      const response = await leadService.createLead({
        ...data,
        status: "new",
        priority: "medium",
      });
      if (response.statusCode === 201) {
        setTriggerFetch(true); // Fetch updated leads after adding a new one
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

  // Since filtering is now done on the server side, we don't need client-side filtering
  // Just determine which leads to show based on active tab  // Debug leads data
  console.log('Current leads array:', leads);
  console.log('Active tab:', activeTab);
  
  const displayedLeads = activeTab === "new" 
    ? leads.filter(lead => {
        console.log('Filtering lead:', lead);
        return lead.status === "new";
      })
    : leads;
  
  // Debug filtered leads
  console.log('Displayed leads:', displayedLeads);

  if (loading) return <LeadSkeleton />;

  if (error) {
    console.error('Error state:', error);
    return (
      <div className="p-8 text-center text-red-500 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Header */}
     

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 p-4 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="mb-6">
            <div className="relative bg-white dark:bg-gray-700 rounded-md shadow-sm mb-4 flex w-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <FaSearch className="text-gray-500 dark:text-gray-400" />
              </div>              <input
                type="text"
                className="flex-grow block pl-10 pr-3 py-2 rounded-l-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-0"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setActiveSearchQuery(searchTerm);
                    setTriggerFetch(true);
                  }
                }}
                aria-label="Search leads"
              />
              <button
                className="px-3 py-2 rounded-r-md bg-orange-500 hover:bg-orange-600 text-white flex-shrink-0"
                onClick={() => {
                  setActiveSearchQuery(searchTerm);
                  setTriggerFetch(true);
                }}
                aria-label="Search"
              >
                <FaSearch />
              </button>
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
            </button>{" "}
            <button
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
            </button>            <button
              className={`w-full flex items-center justify-between px-4 py-2 rounded-md mb-2 ${
                activeTab === "new"
                  ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              } transition-colors duration-200`}
              onClick={() => setActiveTab("new")}
            >
              <span>New Leads</span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                {leads.filter((l) => l.status === "new").length}
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
                {leads.length}
              </span>
            </button>
          </div>          <div>
            <h3 className="font-medium mb-2 flex items-center text-gray-700 dark:text-gray-300">
              <FaFilter className="mr-2" />
              Filters
            </h3>
            <select
              className="w-full p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setTriggerFetch(true);
              }}
            >
              <option>All Statuses</option>
              {LEAD_STATUSES.map(status => (
                <option key={status} value={status}>{status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
              ))}
            </select>            <select
              className="w-full p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 mt-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Filter by source"
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setTriggerFetch(true);
              }}
            >
              <option>All Sources</option>
              <option>whatsapp</option>
            </select>
            <select
              className="w-full p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 mt-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Filter by priority"
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setTriggerFetch(true);
              }}
            >
              <option>All Priorities</option>
              <option>high</option>
              <option>medium</option>
              <option>low</option>
            </select>            <button
              className="w-full mt-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-md transition-colors duration-200"
              onClick={() => {
                setSearchTerm('');
                setActiveSearchQuery('');
                setStatusFilter('All Statuses');
                setSourceFilter('All Sources');
                setPriorityFilter('All Priorities');
                setTriggerFetch(true);
              }}
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-2 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <div className="p-2 md:p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                {" "}
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
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
                  </button>{" "}
                </div>
              </div>              <div
                className="overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 100px)" }}
              >
                {activeTab === "today-followups" ? (
                  todayFollowups.count !== 0 ? (
                    todayFollowups.followUps.map((followUp) => (
                      <UpcommingFollowups
                        key={followUp._id}
                        followUp={followUp}
                        onSuccess={handleChildSuccess}
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
                        key={followUp._id}
                        followUp={followUp}
                        onSuccess={handleChildSuccess}
                      />
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-xl font-light">
                      No overdue follow-ups
                    </div>
                  )                ) : activeTab === "upcoming-followups" ? (
                  upcomingFollowups.count !== 0 ? (
                    upcomingFollowups.data.map((followUp) => (
                      <UpcommingFollowups
                        key={followUp._id}
                        followUp={followUp}
                        onSuccess={handleChildSuccess}
                      />
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-xl font-light">
                      No upcoming follow-ups
                    </div>
                  )
                ) : displayedLeads.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-xl font-light">
                    No leads found. {activeTab === "new" ? "Create a new lead to get started." : "Try adjusting your filters."}
                  </div>
                ) : (
                  displayedLeads.map((lead) => (
                    <LeadCard 
                      key={lead._id}
                      lead={lead} 
                      isAdmin={isAdmin}
                    />
                  ))
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
                </label>                <select
                  id="source"
                  {...register("source")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select source</option>
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
