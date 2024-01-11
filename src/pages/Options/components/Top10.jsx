import { motion } from 'framer-motion';
import React, { useState } from 'react';

const TabButton = ({ activeTab, handleTabClick, tabName, children }) => (
  <button
    onClick={() => handleTabClick(tabName)}
    className={`${
      activeTab === tabName
        ? 'bg-zomato-800 text-zomato-100 font-semibold'
        : 'bg-zomato-300'
    } p-4 flex-grow`}
  >
    {children}
  </button>
);

const TabList = ({ list }) => (
  <ul>
    {list.map((item, index) => (
      <li key={index} className="mb-2">
        <div className="text-sm text-gray-800">{item}</div>
      </li>
    ))}
  </ul>
);

const Top10Tabs = ({ food, places }) => {
  const [activeTab, setActiveTab] = useState('food');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const foodList = food.map((a) => `${a.name} : (${a.count})`);
  const placesList = places.map((a) => `${a.resInfo?.name} : (${a.count})`);

  return (
    <motion.div
      className="w-1/3 border rounded border-zomato-400 bg-zomato-100"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="flex">
        <TabButton
          activeTab={activeTab}
          handleTabClick={handleTabClick}
          tabName="food"
        >
          Most Enjoyed Food
        </TabButton>

        <TabButton
          activeTab={activeTab}
          handleTabClick={handleTabClick}
          tabName="places"
        >
          Most Ordered From
        </TabButton>
      </div>

      <div className="mt-4 p-400 p-4">
        {activeTab === 'food' && <TabList list={foodList} />}
        {activeTab === 'places' && <TabList list={placesList} />}
      </div>
    </motion.div>
  );
};

export default Top10Tabs;
