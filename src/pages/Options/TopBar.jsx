// TopBar.jsx
import React from 'react';
import { FaUser, FaCog, FaSun } from 'react-icons/fa';

const TopBar = () => {
  return (
    <div className="bg-gray-600 h-16 flex justify-end items-center p-4">
      {/* Profile Icon */}
      <div className="mx-2">
        <FaUser size={20} />
      </div>

      {/* Settings Icon */}
      <div className="mx-2">
        <FaCog size={20} />
      </div>

      {/* Theme Switcher Icon */}
      <div className="mx-2">
        <FaSun size={20} />
      </div>
    </div>
  );
};

export default TopBar;
