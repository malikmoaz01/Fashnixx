import React, { useState, useEffect } from 'react';
import { Bell, LogOut, ShoppingBag } from 'lucide-react';

const Header = ({ onLogout, notifications = [], onNotificationClear }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [orderCount, setOrderCount] = useState(3);

  // Update notification count whenever notifications array changes
  useEffect(() => {
    setNotificationCount(notifications.length);
  }, [notifications]);

  // Function to handle notification click
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  // Function to clear a notification
  const clearNotification = (id) => {
    if (onNotificationClear) {
      onNotificationClear(id);
    }
  };

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (showNotifications && !event.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  return (
    <div className="header w-full flex items-center justify-between p-4 bg-gradient-to-b from-[#1F2937] to-[#4B5563] shadow-md sticky top-0 z-10">
      {/* Left side - Title */}
      <div className="flex-1 ml-10 md:ml-4">
        <h1 className="text-lg md:text-2xl font-semibold text-white">Admin Dashboard</h1>
      </div>
      
      {/* Right side - Icons and logout */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Notification bell */}
        <div className="relative notification-container">
          <Bell 
            className="w-6 h-6 text-white cursor-pointer hover:text-gray-200" 
            onClick={handleNotificationClick}
          />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#FF7849] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
          
          {/* Notification dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 md:w-80 bg-white rounded-md shadow-lg py-1 z-50">
              <div className="py-2 px-3 bg-gray-100 border-b border-gray-200">
                <h3 className="text-sm font-medium">Notifications</h3>
              </div>
              
              {notifications.length === 0 ? (
                <div className="py-4 px-3 text-center text-gray-500 text-sm">
                  No new notifications
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className="py-2 px-3 hover:bg-gray-100 border-b border-gray-100 flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                        <p className="text-xs text-gray-500">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                      <button 
                        onClick={() => clearNotification(notification.id)}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Clear
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {notifications.length > 0 && (
                <div className="py-2 px-3 text-center border-t border-gray-100">
                  <button 
                    onClick={() => onNotificationClear && onNotificationClear('all')}
                    className="text-xs text-blue-500 hover:text-blue-700"
                  >
                    Clear all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        

        {/* Logout button */}
        <button 
          className="flex items-center gap-2 bg-transparent hover:bg-[#FF7849] text-white font-medium py-2 px-3 md:px-4 border border-[#FF7849] rounded-full transition-colors duration-200"
          onClick={onLogout}
        >
          <span className="hidden md:inline">Log Out</span>
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Header;