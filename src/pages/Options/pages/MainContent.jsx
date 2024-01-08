import React, { useState, useEffect } from 'react';

import MonthsChart from '../components/MonthsChart';
import Top10 from '../components/Top10';
import {
  generateYearlyReview,
  groupByYears,
  groupOrdersByMonth,
  readifyTimeSlot,
} from '../../../helpers/zomato';
import CardHolder from '../components/CardHolder';
import HourChart from '../components/HourChart';

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

  const convertTimeSlot = (timeSlots) => {
    const a = timeSlots.map((slot) => {
      return { hour: readifyTimeSlot(slot.hour), count: slot.count };
    });
    return a;
  };

  useEffect(() => {
    chrome.storage.local.get(['zomato'], function (result) {
      const allYearObject = groupByYears(result.zomato);

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
    <div className="w-full  bg-gray-50 h-full overflow-hidden">
      <nav className="p-4 flex flex-row space-around sticky top-0 shadow-sm">
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

      <main
        className="h-full overflow-auto"
        style={{ height: 'calc(100vh - 63px)' }}
      >
        <CardHolder yearReview={currentYearReview} />

        <div className="p-4 flex flex-row space-x-2 w-full">
          <MonthsChart monthWise={currentMonthWise} />
          <Top10
            food={currentYearReview.top_dishes}
            places={currentYearReview.top_restaurants}
          />
        </div>

        <div className="p-4 flex flex-row space-x-2 w-full">
          <HourChart
            top10Time={convertTimeSlot(currentYearReview?.top_10_time)}
          />
        </div>
      </main>
    </div>
  );
}

export default MainContent;
