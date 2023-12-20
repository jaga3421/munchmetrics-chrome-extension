import React from 'react';
import { FaHome, FaUser, FaCog } from 'react-icons/fa';

const NavBar = () => {
  return (
    <div className="bg-gray-800 h-screen text-white p-2">
      {/* Logo */}
      <div className="text-center text-xl font-bold mb-4">Your Logo</div>

      {/* Icons */}
      <div className="flex flex-col items-center">
        {/* Icon 1 */}
        <div className="my-2">
          <FaHome size={20} />
        </div>
        {/* Icon 2 */}
        <div className="my-2">
          <FaUser size={20} />
        </div>
        {/* Icon 3 */}
        <div className="my-2">
          <FaCog size={20} />
        </div>
        {/* Add more icons if needed */}
      </div>
    </div>
  );
};

export default NavBar;
