import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import { logout } from '../redux/features/authSlice';
import Loading from './Loading';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { userData, status } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth status whenever redux state or localStorage changes
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setIsAuthenticated(!!accessToken && status);
  }, [status]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  } 
    
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Check if a link is active
  const isActive = (url) => location.pathname === url;

  // Determine dashboard URL based on user role (with fallback)
  const getDashboardUrl = () => {
    if (!userData) return '/admin-dashboard';
    return userData.role === 'employee' ? '/e-dashboard' : '/admin-dashboard';
  };

  const navLinks = [
    {
      name: 'Dashboard',
      url: getDashboardUrl()
    },
    { name: 'Leads', url: '/leads' },
    // { name: 'Contacts', url: '/contacts' },
    // { name: 'Tasks', url: '/tasks' },
  ];
  
  const profileLinks = [
    { name: 'Profile', url: '/profile' },
    { name: 'Settings', url: '/settings' },
  ];
  
  const handleLogout = () => {
    setLoading(true);
    authService.logoutUser()
      .then((response) => {
        if (response.statusCode === 200) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("role");
          dispatch(logout());
          toast.success("Logged out successfully!")
          navigate("/");
          setIsOpen(false);
          setIsProfileOpen(false);
        }
      })
      .catch((error) => {
        // Handle failed logout - still clear local session in case of API failure
        console.error("Logout error:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        dispatch(logout());
        toast.error("Logout failed, but you've been signed out locally");
        navigate("/");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <nav className="bg-white dark:bg-[#1e1e2e]/90 backdrop-blur-md shadow-sm dark:shadow-none border-b border-gray-200 dark:border-[#ffffff10] fixed top-0 w-full z-50 transition-colors duration-300">
      <style>
        {`
          .fade-in { animation: fadeIn 0.2s ease-out; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
          .nav-link { position: relative; }
          .nav-link:after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -2px;
            left: 0;
            background-color: #ff7b25;
            transition: width 0.3s ease;
          }
          .nav-link:hover:after { width: 100%; }
          .nav-link.active:after { width: 100%; }
          .profile-card { box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); }
          .orange-glow { text-shadow: 0 0 8px rgba(255, 123, 37, 0.5); }
        `}
      </style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-gray-900 dark:text-white orange-glow tracking-tight">
                CRM<span className="text-[#ff7b25]">Pro</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated && 
              navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.url}
                  className={`nav-link px-4 py-2 text-sm font-medium text-gray-700 dark:text-white/90 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 ${
                    isActive(link.url) ? 'active' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 group cursor-pointer"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-[#ff7b25]/20 text-orange-500 dark:text-[#ff7b25] border border-orange-200 dark:border-[#ff7b25]/30">
                    {userData?.name?.charAt(0).toUpperCase() || <FaUserCircle size={18} />}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-white/90 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {userData?.name || "User"}
                  </span>
                  <FaChevronDown 
                    size={12} 
                    className={`text-gray-500 dark:text-white/60 transition-transform ${isProfileOpen ? 'transform rotate-180' : ''}`} 
                  />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#2a2a3a] rounded-md profile-card overflow-hidden z-20 fade-in border border-gray-100 dark:border-[#ffffff10]">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-[#ffffff10]">
                      <p className="text-sm text-gray-800 dark:text-white font-medium">{userData?.name || "User"}</p>
                      <p className="text-xs text-gray-500 dark:text-white/60 truncate">{userData?.email || "user@example.com"}</p>
                    </div>
                    <div className="py-1">
                      {profileLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.url}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-[#ff7b25]/10 hover:text-gray-900 dark:hover:text-white transition-colors"
                          onClick={toggleProfile}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                    <div className="py-1 border-t border-gray-100 dark:border-[#ffffff10]">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-[#ff6b6b] hover:bg-red-50 dark:hover:bg-[#ff6b6b]/10 transition-colors cursor-pointer"
                        disabled={loading}
                      >
                        <FaSignOutAlt className="mr-2" />
                        {loading ? 'Logging out...' : 'Logout'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-white/90 hover:text-gray-900 dark:hover:text-white transition-colors nav-link ${
                    isActive('/login') ? 'active' : ''
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`px-3 py-1.5 text-sm font-medium bg-[#ff7b25] text-white rounded-md hover:bg-[#ff7b25]/90 transition-colors shadow-sm shadow-[#ff7b25]/30 ${
                    isActive('/signup') ? 'active' : ''
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-700 dark:text-white/90 hover:text-gray-900 dark:hover:text-white transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/10"
              >
                {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-[#2a2a3a]/95 backdrop-blur-md fade-in border-t border-gray-100 dark:border-[#ffffff10]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="flex items-center justify-center py-2">
              <ThemeToggle />
            </div>
            
            {isAuthenticated ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.url}
                    className={`block px-3 py-2 text-base font-medium text-gray-700 dark:text-white/90 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-md transition-colors ${
                      isActive(link.url) ? 'bg-gray-100 dark:bg-[#ff7b25]/10 text-gray-900 dark:text-white' : ''
                    }`}
                    onClick={toggleMenu}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 dark:text-[#ff6b6b] hover:bg-red-50 dark:hover:bg-[#ff6b6b]/10 rounded-md transition-colors"
                  disabled={loading}
                >
                  <FaSignOutAlt className="mr-2" />
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`block px-3 py-2 text-base font-medium text-gray-700 dark:text-white/90 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-md transition-colors ${
                    isActive('/login') ? 'bg-gray-100 dark:bg-[#ff7b25]/10 text-gray-900 dark:text-white' : ''
                  }`}
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`block px-3 py-2 text-base font-medium text-white bg-[#ff7b25] rounded-md hover:bg-[#ff7b25]/90 transition-colors ${
                    isActive('/signup') ? 'bg-[#ff7b25] text-white' : ''
                  }`}
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

 