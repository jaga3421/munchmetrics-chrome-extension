import React from 'react';

const CardComponent = ({ icon, mainText, subText }) => {
  return (
    <div className="p-4 bg-gray-100 rounded border border-gray-200 flex-grow">
      {/* Subtext */}
      <p className="text-sm text-gray-600 mb-4">{subText}</p>
      <div className="flex items-center mb-1">
        {/* Icon (replace with your actual icon) */}
        <span className="text-2xl text-gray-700 mr-2 ">{icon}</span>

        {/* Main text */}
        <p className="text-4xl  text-gray-400 font-light">{mainText}</p>
      </div>
    </div>
  );
};

export default CardComponent;
