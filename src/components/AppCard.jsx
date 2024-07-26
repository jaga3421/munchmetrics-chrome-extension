import React, { useEffect, useState } from 'react';
import useZomatoScrapper from '../hooks/useZomatoScrapper';
import useSwiggyScrapper from '../hooks/useSwiggyScrapper';
import { generateYearlyReview, groupByYears } from '../helpers/zomato';
import { generateYearlyReview as generateSwiggyReview } from '../helpers/swiggy';
import NoEntryZomato from './NoEntryZomato';
import NoEntrySwiggy from './NoEntrySwiggy';
import { formatINR } from '../helpers/formatINR';

function getUniqueValues(array) {
  return [...new Set(array)];
}

function AppCard() {
  const {
    yearSummary,
    getYearSummary,
    setYearSummary,
    currentPage,
    totalOrders,
    loading,
    error,
  } = useZomatoScrapper();

  const {
    getYearSummarySwiggy,
    totalOrdersSwiggy,
  } = useSwiggyScrapper();
  const [yearlyReview, setYearlyReview] = useState({});
  const [swiggyReview, setSwiggyReview] = useState({});

  const [allYearObject, setAllYearObject] = useState([]);

  const [showNextPage, setShowNextPage] = useState(false);

  

  useEffect(() => {
    if (!loading && !error && yearSummary.length > 0) {
      const ordersByYear = groupByYears(yearSummary);
      const review = generateYearlyReview(yearSummary);
      setAllYearObject(ordersByYear);
      

      setYearlyReview(review);
      chrome.storage.local.set({ zomato: yearSummary });
    }
  }, [error, loading, yearSummary]);



  useEffect(()=>{
    if(swiggyReview.total_orders && yearlyReview.total_orders) {
      setShowNextPage(true)
    }
  },[swiggyReview, yearlyReview])


  // methods

  const collectDataZomato = () => {
    setYearlyReview({});
    setYearSummary([]);
    getYearSummary();
  };

  const onYearSelect = (e) => {
    const year = e.target.value;
    if (year === 'all') {
      setYearlyReview(generateYearlyReview(yearSummary));
    } else {
      setYearlyReview(generateYearlyReview(allYearObject[year]));
    }
  };

  const onAppSelect = ( e) => {
    const app = e.target.value;
    if(app === 'all')  onSelectAll();
    console.log(app)
  }

  const openOptions = () => {
    chrome.tabs.create({
      url: `chrome-extension://${chrome.runtime.id}/options.html`,
    });
  };

  const onLoggedinZomato = () => {
    collectDataZomato();
    
  }
// testng
  const onLoggedinSwiggy = async () => {
    const yearSummarySwiggy = await getYearSummarySwiggy();
    setSwiggyReview(generateSwiggyReview(yearSummarySwiggy))
  }
  
  const showExpenseCTA = () => {
    setShowNextPage(true);
    onSelectAll();
  }

  const onSelectAll = () => {
    const zomato = generateYearlyReview(allYearObject['2024']);
    const swiggy = {...swiggyReview};

    setYearlyReview({
      all_cities : getUniqueValues([...zomato.all_cities, ...swiggy.all_cities]),
      total_cost_spent: Number(zomato.total_cost_spent) + Number(swiggy.total_cost_spent),
      total_orders: Number(zomato.total_orders) + Number(swiggy.total_orders),
      top_dishes: getUniqueValues([...zomato.top_dishes, ...swiggy.top_dishes]),
      top_restaurants: getUniqueValues([...zomato.top_restaurants, ...swiggy.top_restaurants]),
    })

  }

  
  if (!showNextPage)
    return (
      <>
        <div className='flex flex-row space-x-2'>
          <NoEntryZomato
            onLoggedinZomato={onLoggedinZomato}
            loading={loading}
            totalOrders={totalOrders}
            currentOrders={currentPage}
            />
          <NoEntrySwiggy 
            onLoggedinSwiggy={onLoggedinSwiggy}
            loading={loading}
            totalOrders={totalOrders}
            currentOrders={currentPage}
            />
        </div>
        <div className='mt-6'>
          <div>Zomato orders processes: {currentPage}</div>
          <div>Swiggy orders processed: {totalOrdersSwiggy}</div>

          <button className='p-1 bg-blue-500 text-white rounded' onClick={showExpenseCTA}>Show My Expenses</button>

        </div>
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
          {Object.keys(allYearObject)?.map((year, i) => (
            <option value={year} key={i}>
              {year}
            </option>
          ))}
        </select>
        <select
          onChange={onAppSelect}
          className="p-1 px-4 mt-2 border border-gray-200 text-red-400 bg-white"

        >
          <option value={'all'} defaultValue={true}>Swiggy & Zomato</option>
          <option value={'zomato'}>Zomato</option>
          <option value={'swiggy'}>Swiggy</option>
        </select>
      </div>
      <div className="text-xs text-center text-gray-400 mt-8">
        You have spent
      </div>
      <h4 className="font-semibold text-center text-6xl text-red-500 mb-2">
        {formatINR(yearlyReview?.total_cost_spent)}
      </h4>
      <div className="text-xs text-center text-gray-400 mb-8">in Zomato & Swiggy</div>
      <div className="flex flex-row space-x-2 mb-4">
        <div className="flex-1 p-4 border border-gray-200 rounded-xl overflow-hidden bg-white">
          <div className="text-2xl">{yearlyReview?.total_orders}</div>
          <span className="text-md text-gray-500">Total Orders you placed</span>
        </div>

        <div className="flex-1 p-4 border border-gray-200 rounded-xl overflow-hidden bg-white">
          <div className="text-2xl">{yearlyReview.all_cities.length}</div>
          <span className="text-md text-gray-500">
            Cities you ordered from{' '}
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
          className="btn btn-primary bg-red-600 hover:bg-red-400 text-white p-2 border-red-300 rounded w-1/2 mx-auto my-1"
          onClick={openOptions}
        >
          See detailed analysis
        </button>
      </div>
    </>
  );
}

export default AppCard;
