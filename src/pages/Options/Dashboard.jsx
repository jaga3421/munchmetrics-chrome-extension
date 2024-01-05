// Dashboard.jsx
import React from 'react';

import SideNav from './pages/SideNav';
import MainContent from './pages/MainContent';

const Dashboard = () => {
  return (
    <div className="flex flex-row w-screen h-screen text-base ">
      <SideNav />
      <MainContent />
    </div>
  );
};

export default Dashboard;
