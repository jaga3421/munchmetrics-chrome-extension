import React, { useEffect, useState } from 'react';

const NoEntrySwiggy = () => {
  return (
    <div className="flex flex-col bg-blue-50">
      <div className="flex bg-white shadow rounded overflow-hidden ">
        <div
          className="w-1/3 bg-cover"
          style={{
            backgroundPosition: 'center',

            backgroundImage:
              "url('https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png')",
          }}
        ></div>
        <div className="w-2/3 p-8 flex items-center">
          <p className="text-gray-700 text-sm flex items-center">Coming Soon</p>
        </div>
      </div>
    </div>
  );
};

export default NoEntrySwiggy;
