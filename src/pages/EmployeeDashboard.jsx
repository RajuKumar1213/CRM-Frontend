import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaTasks,
  FaUserPlus,
  FaHistory,
  FaDollarSign,
  FaCalendarAlt,
  FaRegBell,
  FaSearch,
  FaRegCommentDots,
  FaChevronRight,
} from "react-icons/fa";
import { FiUsers, FiTrendingUp } from "react-icons/fi";
import { useSelector } from "react-redux";
import RecentActivity from "../components/RecentActivity";
import leadService from "../services/leadService";
import spinner from "/spinner.svg";
import { DashboardSkeleton, Loading, Skeleton } from "../components";
import NewLeads from "../components/NewLeads";
import UpcommingFollowups from "../components/UpcommingFollowups";
import followUpService from "../services/followupService";

const EmployeeDashboard = () => {
  const userData = useSelector((state) => state.auth.userData);
  const [activities, setActivities] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState(null);
  const [followups, setFollowups] = useState(null);
  const [todayfollowups , setTodayfollowups] = useState(null)
  const [dueFolloups , setDueFolloups] = useState(null)



  useEffect(() => {
    leadService.getActivities().then((response) => {
      if (response.statusCode === 200) {
        setActivities(response.data);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
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
    followUpService.getTodayFollowUps().then((response) => {
      if (response.statusCode === 200) {
        setTodayfollowups(response.data);
        setLoading(false);
      }
    }).catch((error)=> {
      console.log(error)
    })
  }, []);

  useEffect(() => {
    followUpService.getOverdueFollowUps().then((response) => {
      if (response.statusCode === 200) {
        setDueFolloups(response.data);
        setLoading(false);
      }
    }).catch((error)=> {
      console.log(error)
    })
  }, []);


  // Sample data
  const stats = {
    activeLeads: leads?.length,
    OverdueFollowups: dueFolloups?.count,
    newLead : leads?.filter((lead)=> lead.status === 'new')?.length,
    upcommingFollowups : followups?.count
  };

  


  if(loading) return <DashboardSkeleton/>

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen pt-16">
      {/* Top Bar */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <h1 className="text-md  font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            {/* <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <FaRegBell />
            </button> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Welcome back, {userData?.name}!
              </h2>
              <p className="text-orange-100 max-w-lg">
                You have {stats.newLead} new leads today and {todayfollowups?.count} followups. Let's make
                this day productive!
              </p>
            </div>
            <Link
              to="/leads"
              className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-white text-orange-600 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-md"
            >
              View Today's Schedule <FaChevronRight className="ml-2" />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Leads */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-orange-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Active Leads
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.activeLeads}
                </h3>
               
              </div>
              <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-500">
                <FaUserPlus size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  New Leads
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.newLead}
                </h3>
                
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-500">
                <FaChartLine size={20} />
              </div>
            </div>
          </div>

          {/* Tasks Due */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Overdue Followups
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.OverdueFollowups}
                </h3>
              
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-500">
                <FaTasks size={20} />
              </div>
            </div>
          </div>

          {/* Conversion Rate */}
        

          {/* Revenue */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Upcomming followups
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats?.upcommingFollowups || 0}
                </h3>
                
              </div>
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-500">
                <FaDollarSign size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}

          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <Link
                to="/activity"
                className="text-sm text-orange-500 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <Loading />
              ) : activities ? (
                activities.map((activity) => (
                  <div
                    key={activity?._id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <RecentActivity activity={activity} />
                  </div>
                ))
              ) : (
                <h1>Not activities found</h1>
              )}
            </div>
          </div>

          {/* Top Leads */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your New Leads
              </h3>
              <Link
                to="/leads"
                className="text-sm text-orange-500 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {leads &&
                leads.map((lead) => <NewLeads lead={lead} key={lead._id} />)}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Upcoming Meetings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Today's followups ({todayfollowups?.count}) 
              </h3>
              <Link
                to="/leads"
                className="text-sm text-orange-500 hover:underline"
              >
                View All
              </Link>
            </div>

            {loading ? (
              <Loading />
            ) : todayfollowups?.count !==0 ? (
              todayfollowups?.followUps?.map((followup) => (
                <UpcommingFollowups key={followup._id} followUp={followup} />
              ))
            ) : (
              <h1 className="text-center pt-10 text-xl font-thin" >No followups Available.</h1>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming followups ({followups?.count})
              </h3>
              <Link
                to="/leads"
                className="text-sm text-orange-500 hover:underline"
              >
                View All
              </Link>
            </div>

            {loading ? (
              <Loading />
            ) : followups ? (
              followups?.data?.slice(0, 3)?.map((followup) => (
                <UpcommingFollowups key={followup._id} followUp={followup} />
              ))
            ) : (
              <h1>No followups Available.</h1>
            )}
          </div>

          {/* Team Performance */}
          {/* <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Team Performance
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-3"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Alex Johnson
                  </span>
                </div>
                <span className="text-sm font-semibold text-green-500">
                  +28%
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-3"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Sarah Miller
                  </span>
                </div>
                <span className="text-sm font-semibold text-green-500">
                  +15%
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-3"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Mark Lee
                  </span>
                </div>
                <span className="text-sm font-semibold text-orange-500">
                  +5%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-3"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Emily Chen
                  </span>
                </div>
                <span className="text-sm font-semibold text-green-500">
                  +22%
                </span>
              </div>
              <Link
                to="/team"
                className="mt-4 inline-flex items-center text-sm text-orange-500 hover:underline"
              >
                View full team stats{" "}
                <FaChevronRight className="ml-1" size={12} />
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
