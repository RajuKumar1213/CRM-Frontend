import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUsers, FaChartLine, FaProjectDiagram, FaBell, FaShieldAlt, FaMobileAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const Home = () => {

  const {status, userData} = useSelector((state) => state.auth)
  const navigate = useNavigate();
  const handleAdminPortalClick = (e) => {
    if (status && userData?.role === "employee") {
      e.preventDefault();
      toast.error("You don't have permission to access the Admin Portal");
      return;
    }
    
    // Navigate based on authentication status
    navigate(status ? "/admin-dashboard" : "/login");
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
    {/* Hero Section */}
    <section className="relative bg-gradient-to-b min-h-screen flex items-center justify-center from-gray-800 to-gray-900 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
      </div>
      
      {/* CRM visual element */}
      <div className="absolute right-10 top-1/4 opacity-20 md:opacity-30 lg:opacity-40">
        <svg width="400" height="400" viewBox="0 0 200 200" className="text-orange-500">
          <path fill="currentColor" d="M100,0 C155.228,0 200,44.772 200,100 C200,155.228 155.228,200 100,200 C44.772,200 0,155.228 0,100 C0,44.772 44.772,0 100,0 Z M30,100 C30,63.431 63.431,30 100,30 C136.569,30 170,63.431 170,100 C170,136.569 136.569,170 100,170 C63.431,170 30,136.569 30,100 Z"></path>
        </svg>
      </div>
  
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Streamline</span> Your Team's Workflow
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
          The <span className="font-semibold text-orange-400">ultimate internal CRM</span> platform designed to boost productivity, enhance collaboration, and secure your organizational data.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            to={status && userData.role === "employee" ? "e-dashboard" :"/login"}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-orange-500/20"
          >
            Access Dashboard
          </Link>          <Link
            className="border-2 border-gray-600 hover:border-orange-500 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 hover:text-orange-400"
            onClick={handleAdminPortalClick}
          >
            Admin Portal
          </Link>
        </div>
        
        {/* Dashboard preview floating in hero */}
        <div className="mt-16 mx-auto max-w-4xl bg-gray-800 rounded-xl p-1.5 shadow-2xl border border-gray-700 transform rotate-1">
          <div className="relative h-64 md:h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMTY1LDAsMC4xKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
            <div className="relative z-10 text-center p-6">
              <div className="flex justify-center mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="h-4 bg-gray-700 rounded-full"></div>
                <div className="h-4 bg-gray-700 rounded-full"></div>
                <div className="h-4 bg-orange-500 rounded-full"></div>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-2 h-20 bg-gray-700 rounded-lg"></div>
                <div className="col-span-7 bg-gray-700 rounded-lg p-3">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="h-6 bg-gray-600 rounded"></div>
                    <div className="h-6 bg-gray-600 rounded"></div>
                    <div className="h-6 bg-orange-500/30 rounded"></div>
                    <div className="h-6 bg-gray-600 rounded"></div>
                  </div>
                </div>
                <div className="col-span-3 bg-gray-700 rounded-lg p-3">
                  <div className="h-6 bg-orange-500/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    {/* Features Section */}
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Powerful</span> Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <FaUsers className="text-orange-500 text-4xl mb-4" />,
              title: "Team Collaboration",
              desc: "Real-time updates, shared contacts, and seamless communication between departments."
            },
            {
              icon: <FaChartLine className="text-orange-500 text-4xl mb-4" />,
              title: "Performance Analytics",
              desc: "Track team metrics, project progress, and generate custom reports with beautiful visualizations."
            },
            {
              icon: <FaShieldAlt className="text-orange-500 text-4xl mb-4" />,
              title: "Enterprise Security",
              desc: "Military-grade encryption, role-based access control, and comprehensive audit logs."
            },
            {
              icon: <FaProjectDiagram className="text-orange-500 text-4xl mb-4" />,
              title: "Project Management",
              desc: "Integrated task tracking with client and contact management in one unified view."
            },
            {
              icon: <FaBell className="text-orange-500 text-4xl mb-4" />,
              title: "Smart Alerts",
              desc: "AI-powered reminders for follow-ups, deadlines, and important relationship milestones."
            },
            {
              icon: <FaMobileAlt className="text-orange-500 text-4xl mb-4" />,
              title: "Mobile Access",
              desc: "Full functionality on any device, with offline capabilities and native app performance."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-gray-700/50 hover:bg-gray-700 p-8 rounded-xl border border-gray-700 hover:border-orange-500/30 transition-all hover:shadow-lg hover:-translate-y-1">
              {feature.icon}
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-300 text-lg">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  
    {/* Dashboard Preview */}
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Unified</span> Dashboard
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything your team needs in one <span className="text-orange-400 font-medium">secure, intuitive</span> interface.
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-1 border border-gray-700 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-96 rounded-lg flex items-center justify-center relative">
            {/* Dashboard mockup */}
            <div className="absolute inset-0 p-6 grid grid-cols-12 gap-4">
              {/* Sidebar */}
              <div className="col-span-2 bg-gray-700/50 rounded-lg p-4">
                <div className="h-8 mb-8 bg-orange-500/20 rounded"></div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 mb-4 bg-gray-600 rounded"></div>
                ))}
              </div>
              
              {/* Main content */}
              <div className="col-span-10 grid grid-rows-6 gap-4">
                {/* Top bar */}
                <div className="row-span-1 bg-gray-700/50 rounded-lg p-4 flex items-center">
                  <div className="w-1/2 h-6 bg-gray-600 rounded-full"></div>
                  <div className="ml-auto w-8 h-8 bg-orange-500/30 rounded-full"></div>
                </div>
                
                {/* Stats cards */}
                <div className="row-span-1 grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`rounded-lg p-4 ${i === 2 ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-gray-700/50'}`}>
                      <div className="h-4 w-1/2 mb-2 bg-gray-600 rounded"></div>
                      <div className="h-6 w-3/4 bg-gray-500 rounded"></div>
                    </div>
                  ))}
                </div>
                
                {/* Main chart */}
                <div className="row-span-3 bg-gray-700/50 rounded-lg p-4">
                  <div className="h-full flex items-end gap-1">
                    {[...Array(12)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`flex-1 ${i === 5 || i === 8 ? 'bg-orange-500' : 'bg-gray-600'}`} 
                        style={{ height: `${Math.random() * 80 + 20}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
                
                {/* Recent activity */}
                <div className="row-span-1 bg-gray-700/50 rounded-lg p-4">
                  <div className="h-full flex items-center">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex-1 h-2/3 bg-gray-600 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    {/* CTA Section */}
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8">
          Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">transform</span> your team's workflow?
        </h2>
        <p className="text-xl text-gray-300 mb-10">
          Join thousands of teams who have revolutionized their internal processes with our CRM platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            to="/login"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-5 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-orange-500/20"
          >
            Get Started Now
          </Link>
          <Link
            to="/demo"
            className="border-2 border-gray-600 hover:border-orange-500 text-white px-12 py-5 rounded-xl font-bold text-lg transition-all transform hover:scale-105 hover:text-orange-400"
          >
            Request Demo
          </Link>
        </div>
      </div>
    </section>
  </div>
  );
};

export default Home;