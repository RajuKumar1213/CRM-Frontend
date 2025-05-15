import React, { useEffect, useState } from "react";
import {
  getDefaultCompanySetting,
  patchCompanySetting,
  addContactNumber,
  removeContactNumber
} from '../services/settingsService';
import { toast } from 'react-hot-toast';
import ThemePreference from './ThemePreference';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [newNumber, setNewNumber] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    getDefaultCompanySetting()
      .then(res => {
        setSettings(res.data.data);
        setForm(res.data.data);
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleIntervalChange = e => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      defaultFollowupIntervals: {
        ...f.defaultFollowupIntervals,
        [name]: Number(value)
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await patchCompanySetting(settings._id, form);
      toast.success('Settings updated successfully');
      setSettings({ ...settings, ...form });
      setEdit(false);
    } catch (e) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddNumber = async () => {
    if (!newNumber) return;
    try {
      const res = await addContactNumber(settings._id, newNumber);
      setSettings(res.data.data);
      setForm(res.data.data);
      setNewNumber("");
      toast.success('Contact number added');
    } catch {
      toast.error('Failed to add number');
    }
  };

  const handleRemoveNumber = async (number) => {
    try {
      const res = await removeContactNumber(settings._id, number);
      setSettings(res.data.data);
      setForm(res.data.data);
      toast.success('Contact number removed');
    } catch {
      toast.error('Failed to remove number');
    }
  };

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-orange-500 flex items-center">
        <svg className="animate-spin h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading settings...
      </div>
    </div>
  );

  if (!settings) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-red-500 flex items-center">
        <svg className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Settings not found
      </div>
    </div>
  );

  return (
    <div className="grid gap-6">
      {/* Basic Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
            <input 
              disabled={!edit} 
              name="companyName" 
              value={form.companyName || ''} 
              onChange={handleChange} 
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo URL</label>
            <input 
              disabled={!edit} 
              name="logo" 
              value={form.logo || ''} 
              onChange={handleChange} 
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
            />
            {form.logo && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                <img src={form.logo} alt="Company Logo Preview" className="h-12 object-contain" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contact Numbers</h3>
        <div className="space-y-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.contactNumbers?.map(num => (
                <span 
                  key={num} 
                  className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
                >
                  {num}
                  {edit && (
                    <button 
                      type="button" 
                      className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
                      onClick={() => handleRemoveNumber(num)}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            {edit && (
              <div className="flex gap-2">
                <input 
                  value={newNumber} 
                  onChange={e => setNewNumber(e.target.value)} 
                  placeholder="Add phone number..." 
                  className="flex-1 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                />
                <button 
                  type="button" 
                  onClick={handleAddNumber}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp Integration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">WhatsApp Integration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API Provider</label>
            <select 
              disabled={!edit} 
              name="whatsappApiProvider" 
              value={form.whatsappApiProvider || ''} 
              onChange={handleChange} 
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
            >
              <option value="">Select provider</option>
              <option value="twilio">Twilio</option>
              <option value="360dialog">360dialog</option>
              <option value="gupshup">Gupshup</option>
              <option value="wati">WATI</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API Key</label>
            <input 
              disabled={!edit} 
              name="whatsappApiKey" 
              value={form.whatsappApiKey || ''} 
              onChange={handleChange} 
              type="password"
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API URL</label>
            <input 
              disabled={!edit} 
              name="whatsappApiUrl" 
              value={form.whatsappApiUrl || ''} 
              onChange={handleChange} 
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors" 
            />
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">System Settings</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="leadRotationEnabled" 
                checked={!!form.leadRotationEnabled} 
                disabled={!edit} 
                onChange={handleChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Lead Rotation</span>
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="numberRotationEnabled" 
                checked={!!form.numberRotationEnabled} 
                disabled={!edit} 
                onChange={handleChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Number Rotation</span>
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="autoFollowupEnabled" 
                checked={!!form.autoFollowupEnabled} 
                disabled={!edit} 
                onChange={handleChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Auto Follow-up</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Default Follow-up Intervals (days)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {form.defaultFollowupIntervals && Object.keys(form.defaultFollowupIntervals).map(key => (
                <div key={key} className="flex items-center gap-3">
                  <span className="capitalize text-sm text-gray-600 dark:text-gray-400 w-24">{key}</span>
                  <input 
                    type="number" 
                    name={key} 
                    value={form.defaultFollowupIntervals[key]} 
                    disabled={!edit} 
                    onChange={handleIntervalChange} 
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors w-20" 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ThemePreference className="my-8" />

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        {!edit ? (
          <button 
            onClick={() => setEdit(true)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
          >
            Edit Settings
          </button>
        ) : (
          <>
            <button 
              onClick={() => { setEdit(false); setForm(settings); }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
