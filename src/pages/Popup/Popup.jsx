import React from 'react';
import './Popup.css';
import AppCard from '../../components/AppCard';

const Popup = () => {
  return (
    <div className="App font-sans bg-gray-50">
      <header className="p-2 py-4 sticky top-0 z-10 bg-gray-400 text-white shadow">
        <h4 className="text-lg">
          <span className="font-bold">MUNCH</span>METRICS
        </h4>
      </header>
      <main className="p-2">
        <AppCard />
      </main>

      <div style={{ textAlign: 'center' }}></div>

      <footer className="p-2 text-center"></footer>
    </div>
  );
};

export default Popup;
