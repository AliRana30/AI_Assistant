import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import Cookies from 'js-cookie';

const Navbar = ({ onStopListening }) => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Logout function
  const logout = async () => {
    // Stop listening before logout if callback provided
    if (onStopListening) {
      onStopListening();
    }
    
    try {
      await axios.get("http://localhost:5000/logout", {
        withCredentials: true,
      });
      Cookies.remove("token");
      localStorage.clear();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCustomize = () => {
    setIsMenuOpen(false); // 🔥 CLOSE MENU
    navigate("/customize");
  };
  
  const handleHome = () => {
    setIsMenuOpen(false); // 🔥 CLOSE MENU
    navigate("/");
  };
  
  const handleHistory = () => {
    setIsMenuOpen(false); // 🔥 CLOSE MENU
    navigate("/history");
  };
  

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={handleHome}
          >
            <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <h1 className="text-xl font-semibold text-white">
              AI Assistant Hub
            </h1>
          </div>
          
          {/* Hamburger Menu for Mobile */}
          <button 
            className="min-[920px]:hidden block text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Navigation Items */}
          <div className={`${isMenuOpen ? 'flex' : 'hidden'} min-[920px]:flex flex-col min-[920px]:flex-row absolute min-[920px]:relative top-16 min-[920px]:top-0 right-0 min-[920px]:right-auto bg-gray-900 min-[920px]:bg-transparent w-48 min-[920px]:w-auto p-4 min-[920px]:p-0 rounded-lg min-[920px]:rounded-none shadow-lg min-[920px]:shadow-none min-[920px]:items-center space-y-2 min-[920px]:space-y-0 min-[920px]:space-x-4`}>
            {/* User Welcome Message */}
            {user?.name && (
              <span className="text-sm text-gray-300">
                Welcome, <span className="font-medium text-purple-400">{user.name}</span>
              </span>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex flex-col min-[920px]:flex-row items-stretch min-[920px]:items-center space-y-2 min-[920px]:space-y-0 min-[920px]:space-x-4">
              <button
                onClick={handleHome}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-blue-500 flex items-center space-x-2 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </button>
              
              <button
                onClick={handleHistory}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-yellow-500 flex items-center space-x-2 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>History</span>
              </button>

              <button
                onClick={handleCustomize}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-purple-500 flex items-center space-x-2 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Customize</span>
              </button>

              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-red-500 flex items-center space-x-2 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;