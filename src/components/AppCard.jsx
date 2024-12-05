import React, { useEffect, useState } from 'react';
import useZomatoScrapper from '../hooks/useZomatoScrapper';
import useSwiggyScrapper from '../hooks/useSwiggyScrapper';
import { generateYearlyReview as generateZomatoReview, groupByYears } from '../helpers/zomato';
import { generateYearlyReview as generateSwiggyReview } from '../helpers/swiggy';


import TwoCards from './TwoCards';
import HomeExpense from './HomeExpense';



function AppCard() {
  const {
    zomatoYearSummary,
    getZomatoYearSummary,
    setZomatoYearSummary,
    zomatoTotalOrders,
    zomatoLoading,
    zomatoError,
  } = useZomatoScrapper();

  const {
    yearSummarySwiggy,
    getYearSummarySwiggy,
    totalOrdersSwiggy,
    swiggyLoading,
    swiggyError,
  } = useSwiggyScrapper();
  const [zomatoReview, setZomatoReview] = useState({});
  const [swiggyReview, setSwiggyReview] = useState({});

  const [loggedIn, setLoggedIn] = useState(false);

  

  useEffect(() => {
    if (zomatoYearSummary?.length > 0 && !zomatoLoading && !zomatoError) {
      chrome.storage.local.set({ zomato: zomatoYearSummary }, function() {
        console.log('Zomato data has been saved.');
      });
      let summary = swiggyReview?.total_cost_spent ? groupByYears(zomatoYearSummary)['2024'] : zomatoYearSummary
      const zomatoData = generateZomatoReview(summary);
      setZomatoReview(zomatoData);
    }
  }, [swiggyReview?.total_cost_spent, zomatoError, zomatoLoading, zomatoYearSummary]);


  // methods
  const openOptions = () => {
    chrome.tabs.create({
      url: `chrome-extension://${chrome.runtime.id}/options.html`,
    });
  };

  const onLoggedinZomato = async () => {
    getZomatoYearSummary();
  }

  const onLoggedinSwiggy = async () => {
    const swiggyYearSummary = await getYearSummarySwiggy();
    setSwiggyReview(generateSwiggyReview(swiggyYearSummary))
    chrome.storage.local.set({ swiggy: swiggyYearSummary }, function() {
      console.log('Zomato data has been saved.');
    });
  }
  
  const navigateToMain = () => {
    setLoggedIn(true);
  }

  if (!loggedIn)
    return (
      <>
        <TwoCards
            onLoggedinZomato={onLoggedinZomato}
            onLoggedinSwiggy={onLoggedinSwiggy}
            totalOrdersZomato={zomatoTotalOrders}
            totalOrdersSwiggy={totalOrdersSwiggy}
            swiggyLoading = { swiggyLoading}
            zomatoLoading={zomatoLoading}
            navigateToMain={navigateToMain}
          />
      </>
     
    );

  if (zomatoError) {
    return (
      <div className="flex p-4 items-center justify-center">
        Something is not right, please try again after sometime
      </div>
    );
  }

  return (
    <>
      <HomeExpense 
        zExpense = {zomatoReview?.total_cost_spent}
        sExpense = {swiggyReview?.total_cost_spent}
      />
    

   
      <div className="text-center mt-3">
        <button
          className="btn btn-primary bg-gray-600 hover:bg-gray-400 text-white p-2 border-blue-300 rounded w-1/2 mx-auto my-1"
          onClick={openOptions}
        >
          See detailed analysis
        </button>
      </div>
    </>
  );
}

export default AppCard;
