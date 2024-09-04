import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import MonthsChart from '../components/MonthsChart';
import Top10 from '../components/Top10';
import {
  generateYearlyReview,
  groupByYears,
  groupOrdersByMonth,
  readifyTimeSlot,
} from '../../../helpers/swiggy';
import CardHolder from '../components/CardHolder';
import HourChart from '../components/HourChart';

function SwiggyContent() {
  const [currentYear, setCurrentYear] = useState(0);
  const [currentYearReview, setCurrentYearReview] = useState({});
  const [currentMonthWise, setCurrentMonthWise] = useState({});
  const [allYears, setAllYears] = useState({});

  const selectYear = () => {
    const years = allYears['2024'];
    setCurrentYearReview(generateYearlyReview(years));


    setCurrentMonthWise(groupOrdersByMonth(years));

    setCurrentYear('2024');
  };

  const convertTimeSlot = (timeSlots) => {
    const a = timeSlots.map((slot) => {
      return { hour: readifyTimeSlot(slot.hour), count: slot.count };
    });
    return a;
  };

  useEffect(() => {
    chrome.storage.local.get(['swiggy'], function (result) {
      const allYearObject = groupByYears(result.swiggy);
      console.log('swigg',allYearObject)
      setAllYears(allYearObject);
      setCurrentYear('2024');
      setCurrentYearReview(
        generateYearlyReview(Object.values(allYearObject).flat())
      );
      console.log(generateYearlyReview(Object.values(allYearObject).flat()));
    });
  }, []);

  if (Object.values(currentYearReview).length === 0)
    return (
      <>
        <div className="w-screen h-screen flex justify-center items-center">
          Please Login to Swiggy and then click the MunchMetrics icon in your chrome extension to get your insights
        </div>
      </>
    );

  return (
    <div className="w-full  bg-orange-300 h-full overflow-hidden">
      <motion.nav
        className="p-4 flex flex-row space-around sticky top-0 shadow-sm bg-orange-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="title">Insights 2024</h1>
        
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

export default SwiggyContent;
