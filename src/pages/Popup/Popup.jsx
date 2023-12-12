import React from 'react';
import './Popup.css';
import AppCard from '../../components/AppCard';

const Popup = () => {
  const openOptions = () => {
    chrome.tabs.create({
      url: `chrome-extension://${chrome.runtime.id}/options.html`,
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h4>
          <strong>MUNCH</strong>METRICS
        </h4>
      </header>
      <main>
        <p className="intro">
          MunchMetrics let you analyse your spendings on food delivery apps such
          as Swiggy and Zomato. Watch the recap of your 'Foodie Year' and know
          what kind of your personality powered by our AI engine.
        </p>

        <AppCard />
      </main>

      <div style={{ textAlign: 'center' }}>
        <button onClick={openOptions}>Get Full Insights</button>
      </div>

      <footer>
        Visit us <a href="#"> MunchMetrics</a>
      </footer>
    </div>
  );
};

export default Popup;
