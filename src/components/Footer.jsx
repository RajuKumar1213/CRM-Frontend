import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">TeamFlow CRM</h3>
          <p className="text-gray-400">
            Internal CRM solution for enterprise teams.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/dashboard" className="text-gray-400 hover:text-blue-400 transition-colors">Dashboard</Link></li>
            <li><Link to="/directory" className="text-gray-400 hover:text-blue-400 transition-colors">Employee Directory</Link></li>
            <li><Link to="/projects" className="text-gray-400 hover:text-blue-400 transition-colors">Projects</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li><Link to="/help" className="text-gray-400 hover:text-blue-400 transition-colors">Help Center</Link></li>
            <li><Link to="/training" className="text-gray-400 hover:text-blue-400 transition-colors">Training</Link></li>
            <li><Link to="/api" className="text-gray-400 hover:text-blue-400 transition-colors">API Documentation</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <p className="text-gray-400">IT Support: itsupport@yourcompany.com</p>
          <p className="text-gray-400">Ext: 4357 (HELP)</p>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
        <p>© {new Date().getFullYear()} TeamFlow CRM. Internal use only.</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;