import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "./Loading";
import whatsappService from "../services/whatsappService";
import WhatsappTemplateManager from './WhatsappTemplateManager';
import { HiRefresh, HiOutlineChat, HiOutlineCalendar, HiOutlineUser, HiTemplate } from 'react-icons/hi';

const WhatsappAdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await whatsappService.getWhatsappStats();
      setStats(res.data);
    } catch (e) {
      setError(e.message || "Failed to load WhatsApp stats");
      toast.error(e.message || "Failed to load WhatsApp stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-2">WhatsApp Analytics Dashboard</h3>
        <p className="text-orange-100">Real-time WhatsApp messaging statistics and management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Messages</p>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalMessages}</h4>
            </div>
            <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
              <HiOutlineChat className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Templates</p>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.messagesByTemplate.length}</h4>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <HiTemplate className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.messagesByUser.length}</h4>
            </div>
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <HiOutlineUser className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Numbers</p>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.phoneNumberUsage.filter(n => n.isActive).length}
              </h4>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
              <HiOutlineCalendar className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Messages by Day</h4>
            <button 
              onClick={fetchStats} 
              className="inline-flex items-center px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <HiRefresh className="w-4 h-4 mr-1" />
              Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Date</th>
                  <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {stats.messagesByDay.map(day => (
                  <tr key={day._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-2">{day._id}</td>
                    <td className="px-4 py-2">{day.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Messages by User</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">User</th>
                  <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Email</th>
                  <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {stats.messagesByUser.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-2 font-medium">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Template Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Messages by Template</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Template</th>
                <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Count</th>
                <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {stats.messagesByTemplate.map(tpl => (
                <tr key={tpl.templateId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-2 font-medium">{tpl.templateName}</td>
                  <td className="px-4 py-2">{tpl.count}</td>
                  <td className="px-4 py-2">{tpl.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>      {/* Sender Numbers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">WhatsApp Sender Numbers</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Number</th>
                <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Messages</th>
                <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Last Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {stats.phoneNumberUsage.map(num => (
                <tr key={num._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-2 font-medium">{num.phoneNumber}</td>
                  <td className="px-4 py-2">{num.name}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      num.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400'
                    }`}>
                      {num.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2">{num.messageCount}</td>
                  <td className="px-4 py-2">{num.lastUsed ? new Date(num.lastUsed).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <WhatsappTemplateManager />
    </div>
  );
};

export default WhatsappAdminPanel;
