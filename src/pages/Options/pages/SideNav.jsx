import React from 'react';
import { FaChartArea } from 'react-icons/fa';

function SideNav() {
  return (
    <div className="w-[240px] h-screen bg-gray-900 px-2 text-gray-100">
      {/* Logo */}
      <div className="main-logo py-2 mb-6">
        <div className="text-2xl text-gray-200 text-center ">
          <span className="font-bold">Munch</span>
          <span className="uppercase">Metrics</span>
        </div>
      </div>

      <div className="sideNav">
        <div className="flex flex-row space-x-4 items-center group p-2 my-2 hover:bg-gray-800 rounded cursor-pointer">
          <span className="p-1 bg-gray-100 group-hover:bg-gray-300 rounded">
            <FaChartArea className="text-gray-800" />
          </span>
          <span className="font-thin tracking-[.2em] uppercase text-sm">
            Insights
          </span>
        </div>
        {/* <div className="flex flex-row space-x-4 items-center group p-2 my-2 hover:bg-gray-800 rounded cursor-pointer">
          <span className="p-1 bg-gray-100 group-hover:bg-gray-300 rounded">
            <FaChartArea className="text-gray-800" />
          </span>
          <span className="font-thin tracking-[.2em] uppercase text-sm">
            2023 Review
          </span>
        </div> */}
      </div>
    </div>
  );
}

export default SideNav;
