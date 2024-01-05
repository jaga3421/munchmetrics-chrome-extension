import React, { useState, useEffect } from 'react';

import MonthsChart from '../components/MonthsChart';
import Top10 from '../components/Top10';
import {
  generateYearlyReview,
  groupByYears,
  groupOrdersByMonth,
} from '../../../helpers/zomato';
import CardHolder from '../components/CardHolder';

function MainContent() {
  const [currentYear, setCurrentYear] = useState(0);
  const [currentYearReview, setCurrentYearReview] = useState({});
  const [currentMonthWise, setCurrentMonthWise] = useState({});
  const [allYears, setAllYears] = useState({});

  const selectYear = (e) => {
    const years =
      e.target.value === 'all'
        ? Object.values(allYears).flat()
        : allYears[e.target.value];
    setCurrentYearReview(generateYearlyReview(years));
    if (e.target.value === 'all') setCurrentMonthWise({});
    else setCurrentMonthWise(groupOrdersByMonth(years));

    setCurrentYear(e.target.value);
  };

  useEffect(() => {
    chrome.storage.local.get(['zomato'], function (result) {
      const allYearObject = groupByYears(result.zomato);
      console.log(allYearObject);
      setAllYears(allYearObject);
      setCurrentYear('all');
      setCurrentYearReview(
        generateYearlyReview(Object.values(allYearObject).flat())
      );
      console.log(generateYearlyReview(Object.values(allYearObject).flat()));
    });
  }, []);

  if (Object.values(currentYearReview).length === 0)
    return (
      <>
        <div>Please wait</div>
      </>
    );

  return (
    <div className="w-full  bg-gray-50">
      <nav className="p-4 flex flex-row space-around">
        <div className="title">Insights {currentYear}</div>
        <div className="ml-auto">
          <select
            onChange={selectYear}
            className="p-1 bg-gray-200 border border-gray-300 rounded"
          >
            <option value={'all'}>Till Date</option>
            {Object.keys(allYears).map((year, i) => (
              <option value={year} key={i}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </nav>
      <CardHolder yearReview={currentYearReview} />

      <div className="p-4 flex flex-row space-x-2 w-full">
        <MonthsChart monthWise={currentMonthWise} />
        <Top10
          food={currentYearReview.top_dishes}
          places={currentYearReview.top_restaurants}
        />
      </div>
    </div>
  );
}

export default MainContent;
