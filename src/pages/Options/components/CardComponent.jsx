import React from 'react';

const CardComponent = ({ icon, mainText, subText }) => {
  return (
    <div className="p-4 bg-zomato-200 rounded border border-zomato-300 flex-grow">
      {/* Subtext */}
      <p className="text-sm text-zomato-600 mb-4 font-semibold">{subText}</p>
      <div className="flex items-center mb-1">
        {/* Icon (replace with your actual icon) */}
        <span className="text-2xl text-zomato-800 mr-2 ">{icon}</span>

        {/* Main text */}
        <p className="text-4xl  text-gray-800 font-light">{mainText}</p>
      </div>
    </div>
  );
};

export default CardComponent;
