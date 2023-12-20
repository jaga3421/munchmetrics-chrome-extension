// Dashboard.jsx
import React from 'react';
import TopBar from './TopBar';
import NavBar from './NavBar';

const Dashboard = () => {
  return (
    <div className="flex">
      <NavBar />

      {/* Main Content */}
      <div className="flex-grow p-4">
        {/* Your Analytics Components */}
        <div className="mb-4">Analytics Component 1</div>
        <div className="mb-4">Analytics Component 2</div>
        {/* Add more analytics components as needed */}
      </div>

      {/* TopBar */}
      <TopBar />
    </div>
  );
};

export default Dashboard;
