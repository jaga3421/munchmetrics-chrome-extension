import React, { useEffect, useState } from 'react';
import { getYearSummary, generateYearlyReview } from '../helpers/zomato';

function AppCard() {
  const [zomatoData, setZomatoData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(chrome.storage.local.get(['zomato-data']));
    chrome.storage.local.get(['zomato-data'], function (result) {
      console.log(result);
      if (result['zomato-data']) {
        setZomatoData(result['zomato-data']);
      }
    });
  }, []);

  const collectData = async () => {
    setLoading(true);
    let yearSummary = await getYearSummary();
    let yearlyReview = generateYearlyReview(yearSummary);

    const formattedDate = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date());
    const data = {
      ...yearlyReview,
      last_updated: formattedDate,
    };
    setZomatoData(data);
    chrome.storage.local.set({ 'zomato-data': data }, function () {
      console.log(data);
      console.log('Zomato data saved.');
      setLoading(false);
    });
  };

  return (
    <>
      <div className="card-panel">
        <div className="flex space-x-4">
          <img
            className="company-logo"
            src="https://b.zmtcdn.com/web_assets/b40b97e677bc7b2ca77c58c61db266fe1603954218.png"
            alt="zomato-logo"
          />
          <div className="mb-2">
            {!loading && zomatoData.total_orders ? (
              <p className="text-2xl font-semibold">
                <b>Total Spent</b>: {zomatoData?.total_cost_spent}
                <br />
                <b>Total Orders</b>: {zomatoData.total_orders}
                <br />
                <b>Top Foods ordered</b>
                <ul>
                  {zomatoData.top_dishes.slice(0, 3).map((food) => (
                    <li>
                      {food.name} ({food.count})
                    </li>
                  ))}
                </ul>
                <b>Top Restaurents ordered</b>
                <ul>
                  {zomatoData.top_restaurants.slice(0, 3).map((rest) => (
                    <li>
                      {rest.resInfo.name} ({rest.count})
                    </li>
                  ))}
                </ul>
                <br />
                Last Updated: {zomatoData.last_updated}
                <button onClick={collectData}>Collect again</button>
              </p>
            ) : loading ? (
              <div className="loader">
                Collecting data .. (please dont close the popup){' '}
              </div>
            ) : (
              <button className="btn" onClick={collectData}>
                Collect Spend data
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AppCard;
