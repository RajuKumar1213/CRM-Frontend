
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaKey, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import Button from './Button';
import Input from './Input';

const ForgetPassword = () => {
  // Professional security/tech image from Unsplash
  const forgotPasswordImageUrl = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

  const [formData, setFormData] = useState({
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email address is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Password reset requested for:', formData.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setErrors({ general: 'Failed to send reset email. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 mt-16 md:mt-20 dark:bg-gray-900 min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="lg:w-1/2 relative bg-gray-100 dark:bg-gray-700">
          <img 
            src={forgotPasswordImageUrl} 
            alt="Security concept" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/30 flex items-end p-8">
            <div className="text-white">
              <FaKey className="w-10 h-10 mb-4 opacity-90" />
              <h3 className="text-2xl font-semibold mb-2">Reset Your Password</h3>
              <p className="text-gray-300 opacity-90">
                Secure access to your account is just a few steps away.
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:w-1/2 p-8 sm:p-12">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" />
            Back to login
          </button>

          <div className="flex items-center justify-center mb-6">
            <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full">
              <FaKey className="text-purple-600 dark:text-purple-400 w-6 h-6" />
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
            {isSubmitted ? 'Check Your Email' : 'Forgot Password'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
            {isSubmitted 
              ? `We've sent a password reset link to ${formData.email}`
              : 'Enter your email to receive a password reset link'}
          </p>

          {errors.general && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-md text-sm">
              {errors.general}
            </div>
          )}

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    error={errors.email}
                    className="w-full pl-10"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full mt-2 py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className="text-center">
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md">
                Password reset email sent successfully!
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Didn't receive the email? Check your spam folder or{' '}
                <button 
                  onClick={() => setIsSubmitted(false)} 
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  try again
                </button>
              </p>
              <Button
                onClick={() => navigate('/login')}
                className="w-full py-3"
              >
                Return to Login
              </Button>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Need help?{' '}
            <Link 
              to="/contact-support" 
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;