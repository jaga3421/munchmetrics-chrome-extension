import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

function ZomatoContent() {
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
    });
  }, []);

  if (Object.values(currentYearReview).length === 0)
    return (
      <>
        <div className="w-screen h-screen flex justify-center items-center">
          Please Login to Zomato and click the MunchMetrics icon in your chrome extension to get your insights
        </div>
      </>
    );

  return (
    <div className="w-full  bg-zomato-100 h-full overflow-hidden">
      <motion.nav
        className="p-4 flex flex-row space-around sticky top-0 shadow-sm bg-zomato-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="title">Insights Zomato ({currentYear})</h1>
        <div className="ml-auto flex space-x-2 text-xs">
          <select
            onChange={selectYear}
            className="p-1 bg-gray-200 border border-gray-300 rounded"
          >
            <option value={'all'}>Till Date</option>
            {Object.keys(allYears)
              .sort((a, b) => b - a)
              .map((year, i) => (
                <option value={year} key={i}>
                  {year}
                </option>
              ))}
          </select>
        </div>
      </motion.nav>

      <main
        className="h-full overflow-auto"
        style={{ height: 'calc(100vh - 63px)' }}
      >
        <CardHolder yearReview={currentYearReview} />

        <div className="p-4 flex flex-row space-x-2 w-full">
          <Top10
            food={currentYearReview.top_dishes}
            places={currentYearReview.top_restaurants}
          />

          <HourChart
            top10Time={convertTimeSlot(currentYearReview?.top_10_time)}
          />
        </div>

        <MonthsChart monthWise={currentMonthWise} currentYear={currentYear} />

        <div className="p-4 flex flex-row space-x-2 w-full"></div>
      </main>
    </div>
  );
}

export default ZomatoContent;
