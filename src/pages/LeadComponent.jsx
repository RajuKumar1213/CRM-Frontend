import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaSearch,
  FaFilter,
  FaPlus,
  FaHistory,
  FaChartBar,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import leadService from "../services/leadService";
import LeadCard from "../components/LeadCard";
import followUpService from "../services/followupService";
import UpcommingFollowups from "../components/UpcommingFollowups";

const LeadComponent = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState(true);

  const [activities, setActivities] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState(null);
  const [followups, setFollowups] = useState(null);
  const [todayfollowups, setTodayfollowups] = useState(null);
  const [dueFolloups, setDueFolloups] = useState(null);

  useEffect(() => {
    followUpService
      .getTodayFollowUps()
      .then((response) => {
        if (response.statusCode === 200) {
          setTodayfollowups(response.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    leadService.getUserLeads().then((response) => {
      if (response.statusCode === 200) {
        setLeads(response.data);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    followUpService.getUpcomingFollowUps().then((response) => {
      if (response.statusCode === 200) {
        setFollowups(response.data);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    followUpService
      .getTodayFollowUps()
      .then((response) => {
        if (response.statusCode === 200) {
          setTodayfollowups(response.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    followUpService
      .getOverdueFollowUps()
      .then((response) => {
        if (response.statusCode === 200) {
          setDueFolloups(response.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    leadService.getUserLeads().then((response) => {
      if (response.statusCode === 200) {
        setLeads(response.data);
        setLoading(false);
      }
    });
  }, []);

  const [selectedLead, setSelectedLead] = useState(null);
  const [activeTab, setActiveTab] = useState("today-followups");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddLead, setShowAddLead] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState({
    date: "",
    time: "",
    type: "Call",
    notes: "",
  });

  const handleAddFollowUp = () => {
    if (!selectedLead || !newFollowUp.date) return;

    const updatedLeads = leads.map((lead) => {
      if (lead.id === selectedLead.id) {
        return {
          ...lead,
          followUps: [
            ...lead.followUps,
            {
              id: lead.followUps.length + 1,
              date: newFollowUp.date,
              type: newFollowUp.type,
              notes: newFollowUp.notes,
              completed: false,
            },
          ],
        };
      }
      return lead;
    });

    setLeads(updatedLeads);
    setNewFollowUp({ date: "", time: "", type: "Call", notes: "" });
  };

  // Toggle follow up completion
  const toggleFollowUp = (leadId, followUpId) => {
    setLeads(
      leads.map((lead) => {
        if (lead.id === leadId) {
          return {
            ...lead,
            followUps: lead.followUps.map((fu) =>
              fu.id === followUpId ? { ...fu, completed: !fu.completed } : fu
            ),
          };
        }
        return lead;
      })
    );
  };

  return (
    <div
      className={`min-h-screen mt-16 ${
        darkMode ? "dark bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      } transition-colors duration-200`}
    >
      {/* Header */}
      <header className="py-4 px-6 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <FaUser className="mr-2 text-orange-500 dark:text-orange-400" />
          Lead Management
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-yellow-300"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button
            onClick={() => setShowAddLead(true)}
            className="flex items-center px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white"
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
              />
            </div>

            <button
              className={`w-full flex items-center justify-between px-4 py-2 rounded-md mb-2 ${
                activeTab === "today-followups"
                  ? "bg-orange-100 dark:bg-orange-900"
                  : ""
              }`}
              onClick={() => setActiveTab("today-followups")}
            >
              <span>Today's followups</span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                {todayfollowups?.count}
              </span>
            </button>

            <button
              className={`w-full flex items-center justify-between px-4 py-2 rounded-md mb-2 ${
                activeTab === "new" ? "bg-orange-100 dark:bg-orange-900" : ""
              }`}
              onClick={() => setActiveTab("new")}
            >
              <span>New Leads</span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                {leads?.filter((l) => l.status === "new").length}
              </span>
            </button>

            <button
              className={`w-full flex items-center justify-between px-4 py-2 rounded-md mb-2 ${
                activeTab === "all" ? "bg-orange-100 dark:bg-orange-900" : ""
              }`}
              onClick={() => setActiveTab("all")}
            >
              <span>All Leads</span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                {leads?.length}
              </span>
            </button>
          </div>

          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <FaFilter className="mr-2" />
              Filters
            </h3>
            <select className="w-full p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
              <option>All Statuses</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Lost</option>
              <option>Converted</option>
            </select>
            <select className="w-full p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 mt-2">
              <option>All Sources</option>
              <option>Website</option>
              <option>Referral</option>
              <option>Trade Show</option>
              <option>Social Media</option>
              <option>Email Campaign</option>
            </select>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Lead List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {activeTab === "today-followups" && "Today's Followups"}
                  {activeTab === "new" && "New Leads"}
                  {activeTab === "all" && "All Leads"}
                </h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <FaHistory />
                  </button>
                  <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <FaChartBar />
                  </button>
                </div>
              </div>

              <div
                className="overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 200px)" }}
              >
                {activeTab === "today-followups" ? (
                  todayfollowups &&
                  todayfollowups?.followUps?.map((followUp) => (
                    <UpcommingFollowups
                      activeTab={activeTab}
                      key={followUp._id}
                      followUp={followUp}
                    />
                  ))
                ) : leads?.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No leads found. Create a new lead to get started.
                  </div>
                ) : activeTab === "new" ? (
                  leads
                    ?.filter((lead) => lead.status === "new")
                    ?.map((lead) => <LeadCard key={lead._id} lead={lead} />)
                ) : (
                  leads?.map((lead) => <LeadCard key={lead._id} lead={lead} />)
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Lead Modal */}
    </div>
  );
};

export default LeadComponent;
