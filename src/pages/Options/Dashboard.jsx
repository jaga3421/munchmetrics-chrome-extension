import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SideNav from './pages/SideNav';
import ZomatoContent from './pages/ZomatoContent';
import SwiggyContent from './pages/SwiggyContent';
import YearReview from './pages/YearReview'; 

const Dashboard = () => {
  return (
    <Router>
      <div className="flex flex-row w-screen h-screen text-base">
        <SideNav />
        <div className="flex-grow">
          <Routes>
            <Route path="/zomato" element={<ZomatoContent />} />
            <Route path="/swiggy" element={<SwiggyContent />} />  
            <Route path="/year-review" element={<YearReview />} />
            <Route path="*" element={<ZomatoContent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default Dashboard;
