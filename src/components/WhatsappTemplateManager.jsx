import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import whatsappService from '../services/whatsappService';
import { HiPlus, HiTrash, HiPencil, HiX } from 'react-icons/hi';

const WhatsappTemplateManager = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', content: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({ name: '', content: '', description: '' });

  useEffect(() => {
    fetchTemplates();
  }, []);
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await whatsappService.getWhatsappTemplates();
      setTemplates(res.data.templates || res.data.data.templates || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTemplate = (tpl) => {
    setEditingTemplate(tpl);
    setNewTemplate({ name: tpl.name, content: tpl.content, description: tpl.description });
    setShowNewTemplateForm(true);
  };

  const handleDeleteTemplate = async (id) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      await whatsappService.deleteWhatsappTemplate(id);
      toast.success('Template deleted');
      fetchTemplates();
    } catch (error) {
      toast.error(error.message || 'Failed to delete template');
    }
  };

  const handleSubmitTemplate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingTemplate) {
        await whatsappService.updateWhatsappTemplate(editingTemplate._id, newTemplate);
        toast.success('Template updated');
      } else {
        await whatsappService.createWhatsappTemplate(newTemplate);
        toast.success('Template created');
      }
      setEditingTemplate(null);
      setNewTemplate({ name: '', content: '', description: '' });
      setShowNewTemplateForm(false);
      fetchTemplates();
    } catch {
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">WhatsApp Template Manager</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and monitor your WhatsApp message templates</p>
        </div>
        <button
          onClick={() => setShowNewTemplateForm(true)}
          className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <HiPlus className="w-5 h-5 mr-1" />
          New Template
        </button>
      </div>

      {showNewTemplateForm && (
        <div className="mb-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-lg font-medium text-gray-900 dark:text-white">
              {editingTemplate ? 'Edit Template' : 'New Template'}
            </h5>
            <button
              onClick={() => {
                setShowNewTemplateForm(false);
                setEditingTemplate(null);
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Template Name
              </label>
              <input
                type="text"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800"
                placeholder="Enter template name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <input
                type="text"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800"
                placeholder="Enter template description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Template Content
              </label>
              <textarea
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800"
                placeholder="Enter template content"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowNewTemplateForm(false);
                  setEditingTemplate(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>              <button
                onClick={handleSubmitTemplate}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                {editingTemplate ? 'Update Template' : 'Save Template'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[20%]">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[25%]">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">            {templates.map((template) => (
              <tr key={template._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  <div className="truncate max-w-[200px]">{template.name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="truncate max-w-[250px]">{template.description}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="line-clamp-2 whitespace-pre-wrap">{template.content}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <HiPencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template._id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WhatsappTemplateManager;
