import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full h-4 bg-gray-300 rounded">
      <div
        style={{ width: `${percentage}%` }}
        className="h-full transition-all duration-500 ease-in-out bg-red-500 rounded"
      ></div>
    </div>
  );
};

export default ProgressBar;
