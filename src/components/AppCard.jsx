import React, { useEffect, useState } from 'react';
import useZomatoScrapper from '../hooks/useZomatoScrapper';
import { generateYearlyReview } from '../helpers/zomato';
import NoEntryZomato from './NoEntryZomato';
import NoEntrySwiggy from './NoEntrySwiggy';
import { formatINR } from '../helpers/formatINR';

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

  const openOptions = () => {
    chrome.tabs.create({
      url: `chrome-extension://${chrome.runtime.id}/options.html`,
    });
  };

  useEffect(() => {
    chrome.storage.local.get(['zomato'], function (result) {
      if (result['zomato']) {
        setYearSummary(result['zomato']);
      }
    });
  }, []);

  useEffect(() => {
    if (!loading && !error && yearSummary.length > 0) {
      const review = generateYearlyReview(yearSummary);

      setYearlyReview(review);
      setOriginalYearlyReview(review);
      chrome.storage.local.set({ zomato: yearSummary });
    }
  }, [error, loading, yearSummary]);

  if (!Object.keys(yearlyReview).length)
    return (
      <>
        <NoEntryZomato
          collectData={collectData}
          loading={loading}
          totalOrders={totalOrders}
          currentOrders={yearSummary.length}
        />
        <NoEntrySwiggy />
      </>
    );

  if (error) {
    return (
      <div className="flex p-4 items-center justify-center">
        Something is not right, please try again after sometime
      </div>
    );
  }

  return (
    <>
      <div className="year-select flex flex-row justify-end space-x-2 text-xs">
        <select
          onChange={onYearSelect}
          className="p-1 px-4 mt-2 border border-gray-200 text-red-400 bg-white"
        >
          <option value={'all'}>Till Date</option>
          {originalYearlyReview?.all_years?.map((year, i) => (
            <option value={year} key={i}>
              {year}
            </option>
          ))}
        </select>
        <select
          oncChange={onYearSelect}
          className="p-1 px-4 mt-2 border border-gray-200 text-red-400 bg-white"
          disabled={true}
        >
          <option value={'zomato'}>Zomato</option>
          <option value={'all'}>All Apps</option>
          <option value={'swiggy'}>Swiggy</option>
        </select>
      </div>
      <div className="text-xs text-center text-gray-400 mt-8">
        You have spent
      </div>
      <h4 className="font-semibold text-center text-6xl text-red-500 mb-2">
        {formatINR(yearlyReview?.total_cost_spent)}
      </h4>
      <div className="text-xs text-center text-gray-400 mb-8">in Zomato</div>
      <div className="flex flex-row space-x-2 mb-4">
        <div className="flex-1 p-4 border border-gray-200 rounded-xl overflow-hidden bg-white">
          <div className="text-2xl">{yearlyReview?.total_orders}</div>
          <span className="text-md text-gray-500">Total Orders you placed</span>
        </div>

        <div className="flex-1 p-4 border border-gray-200 rounded-xl overflow-hidden bg-white">
          <div className="text-2xl">{yearlyReview.total_restaurants}</div>
          <span className="text-md text-gray-500">
            Restaurants you enjoyed{' '}
          </span>
        </div>
      </div>

      <div className="flex flex-row space-x-2 mb-2">
        <div className="mb-2 flex-1 border border-gray-200 rounded-xl overflow-hidden bg-white">
          <div className="text-sm p-2 px-4 mb-2 text-left bg-red-500 text-white">
            Favorite Dishes
          </div>
          <ul className="p-4 py-2 ">
            {yearlyReview.top_dishes?.slice(0, 3).map((food, i) => (
              <li key={i} className="font-light">
                {food.name} <span className="text-xs">({food.count})</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-2 flex-1 border border-gray-200 rounded-xl overflow-hidden bg-white">
          <div className="text-sm p-2 px-4 mb-2 text-left bg-red-500 text-white">
            Favorite Establishmentss
          </div>
          <ul className="p-4 py-2">
            {yearlyReview.top_restaurants?.slice(0, 3).map((restaurants, i) => (
              <li key={i} className="font-light">
                {restaurants.resInfo.name}
                <span className="text-xs">({restaurants.count})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="text-center mt-3">
        <button
          className="btn btn-primary bg-red-300 hover:bg-red-300 text-white p-2 border-red-300 rounded w-1/2 mx-auto my-1 cursor-not-allowed"
          onClick={openOptions}
          disabled={true}
        >
          Get Full Insights (coming soon)
        </button>
      </div>
    </>
  );
}

export default AppCard;
