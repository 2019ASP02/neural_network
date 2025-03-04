import React, { useState, useEffect } from 'react';
import './EmailNotify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const EmailNotify = () => {
  const [notifications, setNotifications] = useState(0); // Track unread notifications
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Simulate fetching unread notifications from an API or WebSocket
    const interval = setInterval(() => {
      if (notifications === 0) {
        setNotifications(1); // Show only one notification
      }
    }, 5000);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [notifications]);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications); // Toggle notifications popup visibility
    if (notifications > 0) {
      setNotifications(0); // Reset notification count when popup is opened
    }
  };

  return (
    <div className="email-notify-container">
      <div className="bell" onClick={handleBellClick}>
        <FontAwesomeIcon icon={faBell} /> {/* Bell icon */}
        {notifications > 0 && (
          <span className="notification-count">{notifications}</span> // Unread notification count
        )}
      </div>
      
      
    </div>
  );
};

export default EmailNotify;
