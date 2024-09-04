import { motion } from 'framer-motion';
import React from 'react';
import { FaChartArea } from 'react-icons/fa';
import { CiCalendarDate } from 'react-icons/ci';
import { NavLink } from 'react-router-dom';

const navLinks = [
  {
    path: '/',
    label: 'Zomato',
    icon: <FaChartArea className="text-gray-800" />,
  },
  {
    path: '/swiggy',
    label: 'Swiggy',
    icon: <FaChartArea className="text-gray-800" />,
  },
  {
    path: '/year-review',
    label: 'Year Review',
    icon: <CiCalendarDate className="text-gray-800" />,
  },
];

function SideNav() {
  return (
    <motion.div
      className="w-[240px] h-screen bg-gray-900 px-2 text-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <div className="main-logo py-2 mb-6">
        <div className="text-2xl text-gray-200 text-center">
          <span className="font-bold">Munch</span>
          <span className="uppercase">Metrics</span>
        </div>
      </div>

      <div className="sideNav">
        {navLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              `flex flex-row space-x-4 items-center group p-2 my-2 rounded cursor-pointer ${
                isActive ? 'bg-gray-800' : 'bg-gray-900'
              }`
            }
          >
            <span className="p-1 bg-gray-100 group-hover:bg-gray-300 rounded">
              {link.icon}
            </span>
            <span className="font-semibold uppercase text-sm">
              {link.label}
            </span>
          </NavLink>
        ))}
      </div>
    </motion.div>
  );
}

export default SideNav;
