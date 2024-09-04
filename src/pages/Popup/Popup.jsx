import React, { useRef, useEffect, useState } from 'react';
import './Popup.css';
import AppCard from '../../components/AppCard';

import { FiRefreshCw } from 'react-icons/fi';

const Popup = () => {
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    if (footerRef.current) {
      setFooterHeight(footerRef.current.offsetHeight);
    }
  }, []);

  const clearData = () => {
    chrome.storage.local.clear();
    chrome.storage.sync.clear();
    window.location.reload();
  };

  return (
    <div
      className="App font-sans bg-gray-50"
      style={{
        maxHeight: `calc(100% - ${footerHeight}px)`,
      }}
    >
      <header
        ref={headerRef}
        className="p-2 sticky top-0 z-10 bg-gray-600 text-gray-100"
      >
        <h4 className="text-base text-center p-2">
          Track your Swiggy & Zomato expense
        </h4>
      </header>
      <main className="p-2">
        <AppCard />
      </main>

      <div style={{ textAlign: 'center' }}></div>

      <footer ref={footerRef} className="p-2 fixed bottom-0 left-0 w-100">
        <div className="flex flex-row justify-end  px-2">
          <FiRefreshCw className="cursor-pointer" onClick={clearData} />
        </div>
      </footer>
    </div>
  );
};

export default Popup;
