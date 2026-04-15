// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  User, 
  ChevronDown, 
  MessageSquare, 
  LogOut, 
  Mail, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Key,
  Fingerprint
} from 'lucide-react';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const systemStatus = 'Operational';

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Open Google Form for feedback
  const openFeedbackForm = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSe9vZJxbGycQ27MawOIEebJa-CTLCz00ez0LB3v895I5b7IuQ/viewform?usp=publish-editor', '_blank');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Get display name from Firebase user
  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    return user.displayName || user.email?.split('@')[0] || 'User';
  };

  // Get user avatar/initial
  

  // Format user details for dropdown
  const getUserDetails = () => {
    if (!user) return { 
      name: 'Not signed in', 
      email: 'N/A', 
      provider: 'N/A',
    };
    
    return {
      name: user.displayName || 'Not provided',
      email: user.email || 'Not provided',
      provider: user.providerData[0]?.providerId || 'email/password',
    };
  };

  const userDetails = getUserDetails();

  // Format provider name for display
  const getProviderDisplayName = (providerId) => {
    const providers = {
      'google.com': 'Google',
      'github.com': 'GitHub',
      'password': 'Email/Password'
    };
    return providers[providerId] || providerId;
  };

  return (
    <nav className="bg-zinc-800 text-white shadow-xl border-b border-zinc-700 sujoy1">
      <div className="w-full mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center space-x-2">
            <h1 className="text-4xl font-bold sujoy3">
              RAGENGINE
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700">
              <div className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  systemStatus === 'Operational' ? 'bg-green-400' : 'bg-yellow-400' 
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  systemStatus === 'Operational' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></span>
              </div>
              <span className="text-sm font-semibold text-white sujoy1">
                {systemStatus}
              </span>
            </div>

            {/* Feedback Button */}
            <button
              onClick={openFeedbackForm}
              className="flex items-center cursor-pointer space-x-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 border border-zinc-700 hover:border-zinc-600 hover:shadow-lg group"
              title="Open Google Feedback Form"
            >
              <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Feedback</span>
            </button>

            {/* User Section with Dropdown */}
            <div className="user-dropdown-container relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center cursor-pointer space-x-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 border border-zinc-700 hover:border-zinc-600 hover:shadow-lg group"
              >
                {user ? (
                  <>
                    <span className="max-w-[100px] sm:max-w-[120px] truncate font-medium text-white">
                      {getUserDisplayName()}
                    </span>
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline text-white">Guest</span>
                  </>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  showDropdown ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-zinc-800 rounded-xl shadow-2xl border border-zinc-700 py-2 z-50 animate-fadeIn">
                  
                  {user ? (
                    <>
                      {/* User Details Section */}
                      <div className="px-4 py-3 border-b border-zinc-700">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-md bold font-semibold text-white truncate">
                              {userDetails.name}
                            </p>
                            <p className="text-md text-zinc-400 truncate">
                              {userDetails.email}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-md">
                            <Shield className="w-4 h-4 text-purple-400" />
                            <span className="text-zinc-400 ml-2">Provider:</span>
                            <span className="text-white ml-2">
                              {getProviderDisplayName(userDetails.provider)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Logout Button */}
                      <div className="px-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-3 py-2.5 text-sm text-red-400 hover:text-red-400 hover:bg-red-700/20 cursor-pointer rounded-lg transition-all duration-150 group"
                        >
                          <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          <span className="ml-2 font-medium">Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-3 text-center">
                      <p className="text-zinc-400 text-sm">Please sign in to view details</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;