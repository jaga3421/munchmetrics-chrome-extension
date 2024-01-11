import { motion } from 'framer-motion';
import React from 'react';
import { FaChartArea } from 'react-icons/fa';
import { CiCalendarDate } from 'react-icons/ci';

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
        <div className="text-2xl text-gray-200 text-center ">
          <span className="font-bold">Munch</span>
          <span className="uppercase">Metrics</span>
        </div>
      </div>

      <div className="sideNav">
        <div className="flex flex-row space-x-4 items-center group p-2 my-2 bg-gray-800 rounded cursor-pointer">
          <span className="p-1 bg-gray-100 group-hover:bg-gray-300 rounded">
            <FaChartArea className="text-gray-800" />
          </span>
          <span className="font-semibold uppercase text-sm">Insights</span>
        </div>
        <div className="flex flex-row space-x-4 items-center group p-2 my-2 hover:bg-gray-800 rounded  cursor-not-allowed">
          <span className="p-1 bg-gray-100 group-hover:bg-gray-300 rounded">
            <CiCalendarDate className="text-gray-800" />
          </span>
          <span className="font-semibold uppercase text-sm">
            Year Review
            <br />
            <span className=" text-gray-400 ml-1" style={{ fontSize: '6px' }}>
              Coming Soon
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default SideNav;
