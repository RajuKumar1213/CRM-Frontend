import React, { useState } from 'react';
import { 
  FaUsers, 
  FaChartBar, 
  FaCog, 
  FaBell, 
  FaSearch, 
  FaRegSun, 
  FaRegMoon,
  FaUserShield,
  FaDatabase,
  FaShieldAlt,
  FaMoneyBillWave,
  FaExchangeAlt
} from 'react-icons/fa';
import { FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false );
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sample data
  const stats = [
    { title: "Total Users", value: "1,284", icon: <FaUsers className="text-orange-500" />, trend: "+12%" },
    { title: "Monthly Revenue", value: "$84,500", icon: <FaMoneyBillWave className="text-green-500" />, trend: "+24%" },
    { title: "Active Sessions", value: "342", icon: <FaUserShield className="text-blue-500" />, trend: "-5%" },
    { title: "Storage Used", value: "65%", icon: <FaDatabase className="text-purple-500" />, trend: "12GB" }
  ];

  const recentActivities = [
    { user: "Admin", action: "updated settings", time: "2 mins ago" },
    { user: "Sarah", action: "deleted a user", time: "1 hour ago" },
    { user: "System", action: "performed backup", time: "3 hours ago" }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* **Top Navigation Bar** */}
      <nav className={`flex justify-between items-center p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-orange-500">CRM<span className="text-gray-700 dark:text-white">Pro</span></h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            {darkMode ? <FaRegSun className="text-yellow-400" /> : <FaRegMoon className="text-gray-600" />}
          </button>
          
          <div className="relative">
            <FaBell className="text-gray-500 dark:text-gray-400 cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </div>
          
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">A</div>
            <span className="font-medium">Admin</span>
          </div>
        </div>
      </nav>

      {/* **Main Dashboard Layout** */}
      <div className="flex">
        {/* **Sidebar** */}
        <div className={`w-64 p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="mb-8">
            <input 
              type="text" 
              placeholder="Search..." 
              className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
            />
          </div>
          
          <ul className="space-y-2">
            {[
              { name: "Dashboard", icon: <FaChartBar /> },
              { name: "Users", icon: <FiUsers /> },
              { name: "Settings", icon: <FiSettings /> },
              { name: "Security", icon: <FaShieldAlt /> },
              { name: "Transactions", icon: <FaExchangeAlt /> }
            ].map((item, index) => (
              <li 
                key={index} 
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${activeTab === item.name.toLowerCase() ? 'bg-orange-500 text-white' : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveTab(item.name.toLowerCase())}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="flex items-center p-3 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <FiLogOut className="mr-3" />
              Logout
            </button>
          </div>
        </div>

        {/* **Main Content** */}
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
          
          {/* **Stats Cards** */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} hover:shadow-lg transition-shadow`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>
                <p className={`mt-3 text-sm ${stat.trend.startsWith('+') ? 'text-green-500' : stat.trend.startsWith('-') ? 'text-red-500' : 'text-blue-500'}`}>
                  {stat.trend}
                </p>
              </div>
            ))}
          </div>
          
          {/* **Recent Activity** */}
          <div className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-8`}>
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <ul className="space-y-4">
              {recentActivities.map((activity, index) => (
                <li key={index} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <FaUserShield className="text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium">{activity.user} <span className="text-gray-500 dark:text-gray-400">{activity.action}</span></p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* **Quick Actions** */}
          <div className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className={`p-4 rounded-lg flex flex-col items-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                <FaUsers className="text-orange-500 text-2xl mb-2" />
                <span>Add User</span>
              </button>
              <button className={`p-4 rounded-lg flex flex-col items-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                <FaCog className="text-blue-500 text-2xl mb-2" />
                <span>Settings</span>
              </button>
              <button className={`p-4 rounded-lg flex flex-col items-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                <FaShieldAlt className="text-green-500 text-2xl mb-2" />
                <span>Security</span>
              </button>
              <button className={`p-4 rounded-lg flex flex-col items-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                <FaDatabase className="text-purple-500 text-2xl mb-2" />
                <span>Backup</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;