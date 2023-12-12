import React, { useEffect, useState } from 'react';
import useZomatoScrapper from '../hooks/useZomatoScrapper';
import { generateYearlyReview } from '../helpers/zomato';

function AppCard() {
  const {
    yearSummary,
    getYearSummary,
    setYearSummary,
    totalOrders,
    loading,
    error,
  } = useZomatoScrapper();
  const [yearlyReview, setYearlyReview] = useState({});
  const [originalYearlyReview, setOriginalYearlyReview] = useState({});

  const collectData = () => {
    setYearlyReview({});
    setYearSummary([]);
    getYearSummary();
  };

  const onYearSelect = (e) => {
    const year = e.target.value;
    if (year === 'all') {
      setYearlyReview(generateYearlyReview(yearSummary));
    } else {
      const yearData = yearSummary.filter(
        (order) => order.orderDate.year === parseInt(year)
      );
      setYearlyReview(generateYearlyReview(yearData));
    }
  };

  useEffect(() => {
    chrome.storage.local.get(['zomato'], function (result) {
      console.log(result);
      if (result['zomato']) {
        setYearSummary(result['zomato']);
      }
    });
  }, []);

  useEffect(() => {
    if (!loading && !error && yearSummary.length > 0) {
      const review = generateYearlyReview(yearSummary);
      console.log(review);
      setYearlyReview(review);
      setOriginalYearlyReview(review);
      chrome.storage.local.set({ zomato: yearSummary });
    }
  }, [error, loading, yearSummary]);

  if (error) {
    return <div>Something is not right, please try again after sometime</div>;
  }

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
            {yearlyReview?.total_orders > -1 ? (
              <div className="text-2xl font-semibold">
                <div className="mb-1">
                  <select className="select" onChange={onYearSelect}>
                    <option value="all">All</option>

                    {originalYearlyReview.all_years?.map((year, i) => (
                      <option key={i} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <b>Total Spent</b>: {yearlyReview?.total_cost_spent}
                <br />
                <b>Total Orders</b>: {yearlyReview.total_orders}
                <br />
                <b>Top Foods ordered</b>
                <ul>
                  {yearlyReview.top_dishes.slice(0, 3).map((food, i) => (
                    <li key={i}>
                      {food.name} ({food.count})
                    </li>
                  ))}
                </ul>
                <b>Top Restaurants ordered</b>
                <ul>
                  {yearlyReview.top_restaurants.slice(0, 3).map((rest, i) => (
                    <li key={i}>
                      {rest.resInfo.name} ({rest.count})
                    </li>
                  ))}
                </ul>
                <br />
                Last Updated: {yearlyReview.last_updated}
                <button onClick={collectData}>Collect again</button>
              </div>
            ) : loading ? (
              <div className="loader">
                Collecting data .. (please don't close the popup)
                <br />
                {yearSummary.length ? (
                  <>
                    Collected Orders: {yearSummary.length}/{totalOrders}
                  </>
                ) : (
                  'Calculating total orders...'
                )}
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
