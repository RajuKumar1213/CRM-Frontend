import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaChartBar, 
  FaCog, 
  FaBell, 
  FaSearch, 
  FaUserShield,
  FaDatabase,
  FaShieldAlt,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaPhoneAlt,
  FaCalendarCheck,
  FaHourglassHalf,
  FaTachometerAlt,
  FaRocket,
  FaCheck,
  FaHourglass,
  FaUserClock,
  FaEnvelope,
  FaChartLine,
  FaRegBell,
  FaHistory
} from 'react-icons/fa';
import { FiUsers, FiSettings, FiLogOut, FiTrendingUp, FiBarChart2, FiPieChart } from 'react-icons/fi';
import { getDashboardStats, getUserPerformance, getCompanyHealth } from '../services/dashboardService';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import AdminDashboardSkeleton from '../components/AdminDashboardSkeleton';
import Settings from '../components/Settings';
import toast from 'react-hot-toast';
import RecentActivity from '../components/RecentActivity';
import leadService from '../services/leadService';
import FollowupActivity from '../components/FollowupActivity';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [userPerformance, setUserPerformance] = useState(null);
  const [companyHealth, setCompanyHealth] = useState(null);
  const [timePeriod, setTimePeriod] = useState('month');
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [activities, setActivities] = useState({ items: [], pagination: null });
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [loadingMoreActivities, setLoadingMoreActivities] = useState(false);
  const [followups, setFollowups] = useState({ items: [], pagination: null });
  const [followupsPage, setFollowupsPage] = useState(1);
  const [loadingMoreFollowups, setLoadingMoreFollowups] = useState(false);
  const [showAllFollowups, setShowAllFollowups] = useState(false);
  const userData = useSelector((state) => state.auth.userData);

  // Fetch activities
  const fetchActivities = async (page = 1, replace = true) => {
    try {
      setLoadingMoreActivities(true);
      const result = await leadService.getActivities(page);
      console.log(result)
      if (result.statusCode === 200) {
        setActivities(prev => ({
          items: replace ? result.data.activities : [...prev.items, ...result.data.activities],
          pagination: result.data.pagination
        }));
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setLoadingMoreActivities(false);
    }
  };

  // Fetch followups
  const fetchFollowups = async (page = 1, replace = true) => {
    try {
      setLoadingMoreFollowups(true);
      const result = await leadService.getFollowups(page);
      if (result.statusCode === 200) {
        setFollowups(prev => ({
          items: replace ? result.data.followUps : [...prev.items, ...result.data.followUps],
          pagination: result.data.pagination
        }));
      }
    } catch (error) {
      toast.error('Failed to load follow-ups');
    } finally {
      setLoadingMoreFollowups(false);
    }
  };

  // Load dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, performanceData, healthData] = await Promise.all([
          getDashboardStats(timePeriod),
          getUserPerformance({ timePeriod }),
          getCompanyHealth()
        ]);
        
        setDashboardData(statsData);
        setUserPerformance(performanceData);
        setCompanyHealth(healthData);
        
        // Fetch initial activities
        await fetchActivities(1, true);
        await fetchFollowups(1, true);
        
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timePeriod]);  // Handle time period change
  const handleTimePeriodChange = (e) => {
    const newTimePeriod = e.target.value;
    setTimePeriod(newTimePeriod);
    setLoading(true); // Show loading state while fetching new data
    
    // Display a toast notification about the change
    const timePeriodLabels = {
      today: 'Today',
      week: 'This Week',
      month: 'This Month',
      year: 'This Year'
    };
    
    toast.success(`Dashboard updated to show: ${timePeriodLabels[newTimePeriod]}`, {
      icon: '📊',
      duration: 3000,
      position: 'top-right'
    });
  };
  // If loading, show loading spinner
  // Function to get the appropriate time period text
  const getTimePeriodText = () => {
    switch(timePeriod) {
      case 'today': return 'today';
      case 'week': return 'this week';
      case 'month': return 'this month';
      case 'year': return 'this year';
      default: return 'this month';
    }
  };

  // Function to get growth rate based on time period
  const getGrowthRate = () => {
    switch(timePeriod) {
      case 'today': return dashboardData.leads.dailyGrowth || 0;
      case 'week': return dashboardData.leads.weeklyGrowth || 0;
      case 'month': return dashboardData.leads.monthlyGrowth || 0;
      case 'year': return dashboardData.leads.yearlyGrowth || 0;
      default: return dashboardData.leads.monthlyGrowth || 0;
    }
  };

  // Function to get new leads value based on time period
  const getNewLeadsValue = () => {
    switch(timePeriod) {
      case 'today': return dashboardData.leads.today || 0;
      case 'week': return dashboardData.leads.thisWeek || 0;
      case 'month': return dashboardData.leads.thisMonth || 0;
      case 'year': return dashboardData.leads.thisYear || 0;
      default: return dashboardData.leads.thisMonth || 0;
    }
  };

  // Prepare stats cards data based on API response
  const statsCards = dashboardData ? [
    { 
      title: "Total Leads", 
      value: dashboardData.leads.total.toLocaleString(), 
      icon: <FaUsers className="text-blue-500" />, 
      trend: `${getGrowthRate() >= 0 ? '+' : ''}${getGrowthRate()}% ${getTimePeriodText()}` 
    },
    { 
      title: `New Leads (${timePeriod === 'today' ? 'Today' : timePeriod === 'week' ? 'This Week' : timePeriod === 'month' ? 'This Month' : 'This Year'})`, 
      value: getNewLeadsValue().toLocaleString(), 
      icon: <FaRocket className="text-green-500" />, 
      trend: `${getNewLeadsValue()} ${getTimePeriodText()}` 
    },
    { 
      title: "Team Members", 
      value: dashboardData.users.total.toLocaleString(), 
      icon: <FaUserShield className="text-purple-500" />, 
      trend: "Active team" 
    },
    { 
      title: "Follow-ups", 
      value: (dashboardData.followUps.upcoming.length + dashboardData.followUps.overdue.length).toString(), 
      icon: <FaCalendarCheck className="text-orange-500" />, 
      trend: `${dashboardData.followUps.overdue.length} overdue` 
    }
  ] : [];

  if(loading ) {
    return <AdminDashboardSkeleton/>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      
      {/* **Top Navigation Bar** */}
      <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-orange-500">CRM<span className="text-gray-700 dark:text-white">Pro</span></h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaBell className="text-gray-500 dark:text-gray-400 cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {dashboardData?.followUps.overdue.length || 0}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
              {userData?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <span className="font-medium">{userData?.name || "Admin"}</span>
          </div>
        </div>
      </nav>

      {/* **Main Dashboard Layout** */}
      <div className="flex flex-col md:flex-row">
        {/* **Sidebar** */}
        <div className="w-full md:w-64 p-4 bg-white dark:bg-gray-800 shadow-lg">
          <div className="mb-8">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <ul className="space-y-2">
            {[
              { name: "Dashboard", icon: <FaTachometerAlt />, id: "dashboard" },
              { name: "Leads", icon: <FaUsers />, id: "leads" },
              { name: "Performance", icon: <FiTrendingUp />, id: "performance" },
              { name: "Company Health", icon: <FiBarChart2 />, id: "company-health" },
              { name: "Settings", icon: <FiSettings />, id: "settings" }
            ].map((item) => (
              <li 
                key={item.id} 
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                  activeTab === item.id 
                    ? 'bg-orange-500 text-white' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
          
    
        </div>

        {/* **Main Content** */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Show error message if API request failed */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <div className="mt-3 md:mt-0 flex items-center">
              <label htmlFor="time-period-select" className="mr-2 text-gray-600 dark:text-gray-300">Time Period:</label>
              <select 
                id="time-period-select"
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white"
                value={timePeriod}
                onChange={handleTimePeriodChange}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
          
          {/* **Stats Cards** */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <div 
                key={index} 
                className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>
                <p className={`mt-3 text-sm ${stat.trend.includes('+') ? 'text-green-500' : stat.trend.includes('-') ? 'text-red-500' : 'text-blue-500'}`}>
                  {stat.trend}
                </p>
              </div>
            ))}
          </div>
          
          {/* **Dashboard Content Based on Active Tab** */}
          {activeTab === 'dashboard' && dashboardData && (
            <>
              {/* **Lead Status Distribution** */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Lead Status Distribution</h3>
                  <div className="space-y-4">
                    {Object.entries(dashboardData.leads.byStatus).map(([status, count]) => (
                      <div key={status} className="relative">
                        <div className="flex justify-between mb-1">
                          <span className="capitalize">{status}</span>
                          <span>{count} leads ({Math.round((count / dashboardData.leads.total) * 100)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${                              status === 'new' ? 'bg-blue-500' : 
                              status === 'in-progress' ? 'bg-yellow-500' : 
                              status === 'won' ? 'bg-green-500' : 
                              'bg-red-500'
                            }`} 
                            style={{ width: `${Math.round((count / dashboardData.leads.total) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* **Lead Sources** */}
                <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Lead Sources</h3>
                  <div className="space-y-4">
                    {Object.entries(dashboardData.leads.bySource).map(([source, count]) => (
                      <div key={source} className="relative">
                        <div className="flex justify-between mb-1">
                          <span className="capitalize">{source || 'Unknown'}</span>
                          <span>{count} leads ({Math.round((count / dashboardData.leads.total) * 100)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              source === 'website' ? 'bg-blue-500' : 
                              source === 'referral' ? 'bg-green-500' : 
                              source === 'social' ? 'bg-purple-500' : 
                              source === 'email' ? 'bg-yellow-500' : 
                              'bg-gray-500'
                            }`} 
                            style={{ width: `${Math.round((count / dashboardData.leads.total) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* **Recent Activity and Follow-ups** */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* **Recent Activity** */}
                <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Recent Activity {timePeriod !== 'month' ? `(${timePeriod === 'today' ? 'Today' : timePeriod === 'week' ? 'This Week' : 'This Year'})` : ''}</h3>
                    <button
                      onClick={() => setShowAllActivities(true)}
                      className="text-sm text-orange-500 hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                      <Loading />
                    ) : activities.items.length === 0 ? (
                      <div className="p-8 text-center">
                        <FaHistory className="mx-auto text-gray-300 dark:text-gray-600 text-4xl mb-3" />
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium">No recent activities</h3>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                          Recent activities will appear here
                        </p>
                      </div>
                    ) : (
                      activities.items.slice(0, 5).map((activity) => (
                        <div
                          key={activity._id}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <RecentActivity activity={activity} />
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* **Follow-ups** */}
                <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Follow-ups</h3>
                    <button
                      onClick={() => setShowAllFollowups(true)}
                      className="text-sm text-orange-500 hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                      <Loading />
                    ) : followups.items.length === 0 ? (
                      <div className="p-8 text-center">
                        <FaHourglassHalf className="mx-auto text-gray-300 dark:text-gray-600 text-4xl mb-3" />
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium">No follow-ups scheduled</h3>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                          Follow-ups will appear here
                        </p>
                      </div>
                    ) : (
                      followups.items.slice(0, 5).map((followup) => (
                        <div
                          key={followup._id}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <FollowupActivity followup={followup} />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Modal for showing all activities */}
              {showAllActivities && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        All Activities
                      </h3>
                      <button
                        onClick={() => {
                          setShowAllActivities(false);
                          setActivitiesPage(1);
                          fetchActivities(1);
                        }}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="overflow-y-auto flex-grow divide-y divide-gray-200 dark:divide-gray-700" id="activity-modal-list">
                      {activities.items.map((activity) => (
                        <div
                          key={activity._id}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <RecentActivity activity={activity} />
                        </div>
                      ))}
                      {loadingMoreActivities && (
                        <div className="p-4 flex justify-center">
                          <Loading />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {activities.items.length} of {activities.pagination?.totalActivities || 0} activities
                      </div>
                      <div className="flex gap-2">
                        {activities.pagination?.hasMore && (
                          <button
                            onClick={async () => {
                              setActivitiesPage(prev => prev + 1);
                              await fetchActivities(activitiesPage + 1, false);
                              // Scroll to the bottom after loading more
                              setTimeout(() => {
                                const list = document.getElementById('activity-modal-list');
                                if (list) list.scrollTop = list.scrollHeight;
                              }, 100);
                            }}
                            disabled={loadingMoreActivities}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                          >
                            {loadingMoreActivities ? 'Loading...' : 'Load More'}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setShowAllActivities(false);
                            setActivitiesPage(1);
                            fetchActivities(1);
                          }}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal for showing all followups */}
              {showAllFollowups && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        All Follow-ups
                      </h3>
                      <button
                        onClick={() => {
                          setShowAllFollowups(false);
                          setFollowupsPage(1);
                          fetchFollowups(1);
                        }}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="overflow-y-auto flex-grow divide-y divide-gray-200 dark:divide-gray-700" id="followup-modal-list">
                      {followups.items.map((followup) => (
                        <div
                          key={followup._id}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <FollowupActivity followup={followup} />
                        </div>
                      ))}
                      {loadingMoreFollowups && (
                        <div className="p-4 flex justify-center">
                          <Loading />
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {followups.items.length} of {followups.pagination?.total || 0} follow-ups
                      </div>
                      <div className="flex gap-2">
                        {followups.pagination?.next && (
                          <button
                            onClick={async () => {
                              setFollowupsPage(prev => prev + 1);
                              await fetchFollowups(followupsPage + 1, false);
                              setTimeout(() => {
                                const list = document.getElementById('followup-modal-list');
                                if (list) list.scrollTop = list.scrollHeight;
                              }, 100);
                            }}
                            disabled={loadingMoreFollowups}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                          >
                            {loadingMoreFollowups ? 'Loading...' : 'Load More'}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setShowAllFollowups(false);
                            setFollowupsPage(1);
                            fetchFollowups(1);
                          }}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'performance' && userPerformance && (
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md mb-8">
              <h3 className="text-xl font-semibold mb-6">User Performance</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Employee
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Leads
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Qualified
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Closed Won
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Conversion Rate
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Activities
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {userPerformance.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                              {user.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.stats.totalLeads}
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({user.stats.newLeads} new)</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{user.stats.qualifiedLeads}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{user.stats.closedWonLeads}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.stats.conversionRate > 30 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                                : user.stats.conversionRate > 15 
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                            }`}>
                              {user.stats.conversionRate}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.stats.totalActivities}
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({user.stats.activityPerLead} per lead)</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'company-health' && companyHealth && (
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                <h3 className="text-xl font-semibold mb-6">Company Health & Trends</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <h4 className="text-lg font-medium mb-2">Avg. Conversion Time</h4>
                    <div className="flex items-center">
                      <FaUserClock className="text-2xl text-blue-500 mr-3" />
                      <div>
                        <p className="text-2xl font-bold">{companyHealth.averageConversionTime} days</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">from lead to customer</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <h4 className="text-lg font-medium mb-2">Monthly Growth</h4>
                    <div className="flex items-center">
                      <FiTrendingUp className="text-2xl text-green-500 mr-3" />
                      <div>
                        {companyHealth.monthlyTrends.length >= 2 && (
                          <>
                            <p className="text-2xl font-bold">
                              {(() => {
                                const currentMonth = companyHealth.monthlyTrends[companyHealth.monthlyTrends.length - 1].leads;
                                const prevMonth = companyHealth.monthlyTrends[companyHealth.monthlyTrends.length - 2].leads;
                                const growthRate = prevMonth === 0 ? 100 : Math.round(((currentMonth - prevMonth) / prevMonth) * 100);
                                return `${growthRate >= 0 ? '+' : ''}${growthRate}%`;
                              })()}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">in lead generation</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <h4 className="text-lg font-medium mb-2">Conversion Rate</h4>
                    <div className="flex items-center">
                      <FaCheck className="text-2xl text-green-500 mr-3" />
                      <div>
                        {companyHealth.monthlyTrends.length > 0 && (
                          <>
                            <p className="text-2xl font-bold">
                              {(() => {
                                const totalLeads = companyHealth.monthlyTrends.reduce((sum, month) => sum + month.leads, 0);
                                const totalConversions = companyHealth.monthlyTrends.reduce((sum, month) => sum + month.conversions, 0);
                                return `${totalLeads > 0 ? Math.round((totalConversions / totalLeads) * 100) : 0}%`;
                              })()}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">overall success rate</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <h4 className="text-lg font-medium mb-4">Monthly Trends</h4>
                <div className="relative h-80">
                  <div className="absolute inset-0 flex items-end">
                    {companyHealth.monthlyTrends.map((month, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full px-1">
                          <div 
                            className="w-full bg-blue-500 rounded-t"
                            style={{ 
                              height: `${Math.max(5, (month.leads / Math.max(...companyHealth.monthlyTrends.map(m => m.leads))) * 200)}px` 
                            }}
                          ></div>
                          <div 
                            className="w-full bg-green-500 rounded-t mt-1"
                            style={{ 
                              height: `${Math.max(5, (month.conversions / Math.max(...companyHealth.monthlyTrends.map(m => m.leads))) * 200)}px` 
                            }}
                          ></div>
                        </div>
                        <div className="text-xs mt-2 text-center">
                          <div>{month.month}</div>
                          <div>{month.year}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center mt-4 space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                    <span className="text-sm">Leads</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                    <span className="text-sm">Conversions</span>
                  </div>
                </div>
              </div>
              
              {/* Recent Conversions */}
              <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                <h3 className="text-xl font-semibold mb-4">Recent Conversions</h3>
                {companyHealth.recentConversions.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No recent conversions</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Lead
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Closed By
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Product
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Conversion Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {companyHealth.recentConversions.map((conversion) => (
                          <tr key={conversion._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium">{conversion.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{conversion.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {conversion.assignedTo?.name || 'Unassigned'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {conversion.product || 'Not specified'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                conversion.conversionTime < 7 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                                  : conversion.conversionTime < 14 
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' 
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                              }`}>
                                {conversion.conversionTime} days
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'leads' && dashboardData && (
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md mb-8">
              <h3 className="text-xl font-semibold mb-4">Lead Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 flex flex-col items-center">
                  <h4 className="text-orange-500 font-semibold mb-2">Weekly Growth</h4>
                  <div className="text-3xl font-bold mb-1">
                    {dashboardData.leads.weeklyGrowth >= 0 ? '+' : ''}{dashboardData.leads.weeklyGrowth}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {dashboardData.leads.thisWeek} this week vs {dashboardData.leads.lastWeek} last week
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 flex flex-col items-center">
                  <h4 className="text-green-500 font-semibold mb-2">Monthly Growth</h4>
                  <div className="text-3xl font-bold mb-1">
                    {dashboardData.leads.monthlyGrowth >= 0 ? '+' : ''}{dashboardData.leads.monthlyGrowth}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {dashboardData.leads.thisMonth} this month vs {dashboardData.leads.lastMonth} last month
                  </div>
                </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 flex flex-col items-center">
                  <h4 className="text-blue-500 font-semibold mb-2">Conversion Analytics</h4>
                  <div className="text-3xl font-bold mb-1">
                    {dashboardData.leads.byStatus['won'] 
                      ? Math.round((dashboardData.leads.byStatus['won'] / dashboardData.leads.total) * 100) 
                      : 0}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Overall conversion rate
                  </div>
                </div>
              </div>
            </div>
          )}          {activeTab === 'settings' && (
            <div className="max-w-5xl mx-auto">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Company Settings</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Manage your company's configuration, contact information, and operational settings.
                </p>
              </div>
              <Settings />
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;