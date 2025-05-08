import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaChartLine, FaProjectDiagram, FaBell, FaShieldAlt, FaMobileAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Home = () => {

  const {status, userData} = useSelector((state) => state.auth)

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      {/* Navigation */}
      <nav className="bg-gray-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <FaProjectDiagram className="text-blue-400 text-2xl mr-2" />
            <span className="text-xl font-bold">TeamFlow CRM</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link to="/features" className="hover:text-blue-400 transition-colors">Features</Link>
            <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
            <Link to="/support" className="hover:text-blue-400 transition-colors">Support</Link>
          </div>
          <div>
            <Link 
              to="/login" 
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition-colors"
            >
              Employee Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-blue-400">Streamline</span> Your Team's Workflow
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            The internal CRM platform designed to enhance productivity, collaboration, and data security for your organization.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={status && userData.role === "employee" ? "e-dashboard" :"/login"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium text-lg transition-colors"
            >
              Access Dashboard
            </Link>
            <Link
              to={"/admin-dashboard"}
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-md font-medium text-lg transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-blue-400">Key</span> Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors">
              <FaUsers className="text-blue-400 text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-300">
                Real-time updates, shared contacts, and seamless communication between departments.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors">
              <FaChartLine className="text-blue-400 text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
              <p className="text-gray-300">
                Track team metrics, project progress, and generate custom reports.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors">
              <FaShieldAlt className="text-blue-400 text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-gray-300">
                Role-based access control, data encryption, and audit logs.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors">
              <FaProjectDiagram className="text-blue-400 text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Project Management</h3>
              <p className="text-gray-300">
                Integrated task tracking with client and contact management.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors">
              <FaBell className="text-blue-400 text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Alerts</h3>
              <p className="text-gray-300">
                Automated reminders for follow-ups, deadlines, and important updates.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors">
              <FaMobileAlt className="text-blue-400 text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Mobile Access</h3>
              <p className="text-gray-300">
                Full functionality on any device, with offline capabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-400">Unified</span> Dashboard
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything your team needs in one secure, intuitive interface.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-2 border border-gray-700 shadow-xl">
            <div className="bg-gray-700 h-64 rounded-md flex items-center justify-center">
              <span className="text-gray-400">Dashboard Preview</span>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-blue-400">Admin</span> Tools
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powerful controls for managing your organization's CRM environment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">User Management</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Role-based permissions and access controls
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Department-specific views and workflows
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Onboarding and offboarding automation
                </li>
              </ul>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Data Governance</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Custom field configuration
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Data export and backup controls
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Compliance reporting tools
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to <span className="text-blue-400">transform</span> your team's workflow?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Contact your system administrator for access or setup instructions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium text-lg transition-colors"
            >
              Employee Login
            </Link>
            <Link
              to="/admin"
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-md font-medium text-lg transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;