import { useState } from 'react';

const useZomatoScrapper = () => {
  const [yearSummary, setYearSummary] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  let summary = [];

  const fetchData = async (pageNumber, track) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://www.zomato.com/webroutes/user/orders?page=${pageNumber}`
      );
      const data = await response.json();
      // increment the page number

      setTotalOrders(data.sections.SECTION_USER_ORDER_HISTORY.count);
      if (track) {
        setCurrentPage(
          (prev) => prev + Object.keys(data.entities.ORDER).length
        );
      }
      return data;
    } catch (error) {
      setLoading(false);
      setError(error);
      console.error(`Error fetching data for page ${pageNumber}:`, error);
      throw error;
    }
  };

  const getYearSummary = async () => {
    chrome.storage.local.get('zomatePages', async function (res) {
      const totalPages = res.zomatePages;

      const pagesArray = Array.from(Array(totalPages).keys()).map(
        (item) => item + 1
      );
      const promises = pagesArray.map((pageNumber) =>
        fetchData(pageNumber, true)
      );

      try {
        const results = await Promise.all(promises);

        results.forEach((result) => {
          const orders = result.entities.ORDER;
          Object.keys(orders).forEach((orderId) => {
            const Order = {
              ...orders[orderId],
              dishes: processDishString(orders[orderId].dishString),
              orderDate: processOrderDate(orders[orderId].orderDate),
            };
            summary.push(Order);
          });
        });
        setLoading(false);
        setYearSummary(summary);

        return summary;
      } catch (error) {
        console.error('Error in getYearSummary:', error);
        setError(error);
        throw error;
      }
    });
  };

  function processDishString(dishString) {
    // Split the dishString by comma and trim spaces
    const dishesArray = dishString.split(',').map((item) => item.trim());

    // Map through the dishesArray and extract the dish name
    const dishNames = dishesArray.map((item) => {
      const parts = item.split('x');
      const count = parseInt(parts[0].trim()) || 1; // Use 1 if the count is not provided or not a valid number
      const dishName = parts[1]?.trim();
      return Array(count).fill(dishName);
    });

    // Flatten the array and return the result
    return [].concat(...dishNames);
  }

  function processOrderDate(orderDate) {
    /* Transform the string (example: "February 16, 2023 at 02:01 PM") 
                into object of the form { year: 2023, month: 2, day: 16, timeSlot: 14 } 
                timeSlot is the interval of 1 hour starting from 0 to 23
        */
    const date = new Date(orderDate.replace('at', ''));
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-11
    const day = date.getDate();
    const timeSlot = date.getHours(); // 24-hour format

    return { year, month, day, timeSlot };
  }

  return {
    zomatoYearSummary: yearSummary,
    getZomatoYearSummary: getYearSummary,
    setZomatoYearSummary: setYearSummary,
    zomatoCurrentPage: currentPage,
    zomatoTotalOrders: totalOrders,
    zomatoLoading: loading,
    zomatoError: error
  };
};

export default useZomatoScrapper;
