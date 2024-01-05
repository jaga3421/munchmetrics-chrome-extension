import React, { useState } from 'react';

const Top10Tabs = ({ food, places }) => {
  const [activeTab, setActiveTab] = useState('food');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const foodList = food.map((a) => `${a.name} : (${a.count})`);
  const placesList = places.map((a) => `${a.resInfo?.name} : (${a.count})`);

  return (
    <div className="w-4/6 border rounded">
      <div className="flex ">
        <button
          onClick={() => handleTabClick('food')}
          className={`${
            activeTab === 'food' ? 'bg-gray-500 text-gray-100' : 'bg-gray-300'
          } px-4 py-2  flex-grow`}
        >
          Most Enjoyed Food
        </button>

        <button
          onClick={() => handleTabClick('places')}
          className={`${
            activeTab === 'places' ? 'bg-gray-500 text-gray-100' : 'bg-gray-300'
          } px-4 py-2  flex-grow`}
        >
          Most Ordered From
        </button>
      </div>

      <div className="mt-4 p-4">
        {activeTab === 'food' && (
          <ul>
            {foodList.map((item, index) => (
              <li key={index} className="mb-2">
                {item}
              </li>
            ))}
          </ul>
        )}

        {activeTab === 'places' && (
          <ul>
            {placesList.map((item, index) => (
              <li key={index} className="mb-2">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Top10Tabs;
