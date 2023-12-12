import { useState } from 'react';

const useZomatoScrapper = () => {
  const [yearSummary, setYearSummary] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  let summary = [];

  const getYearSummary = async (page = 1, resultArray = []) => {
    setLoading(true);

    const url = `https://www.zomato.com/webroutes/user/orders?page=${page}`;

    try {
      console.log(`Page ${page} in progress.`);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const orders = data.entities.ORDER;

      Object.keys(orders).forEach((orderId) => {
        const summaryObject = {
          ...orders[orderId],
          dishes: processDishString(orders[orderId].dishString),
          orderDate: processOrderDate(orders[orderId].orderDate),
        };
        summary.push(summaryObject);
        setYearSummary((prev) => [...prev, summaryObject]);
      });

      // Continue the recursion only if there are more pages
      const userOrderHistory = data.sections.SECTION_USER_ORDER_HISTORY;
      setTotalOrders(userOrderHistory.count);
      if (userOrderHistory.currentPage <= userOrderHistory.totalPages) {
        return await getYearSummary(
          userOrderHistory.currentPage + 1,
          resultArray
        );
      } else {
        console.log(summary);
        setYearSummary(summary);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error in getYearSummary:', error);
      setLoading(false);
      setError(error);
      throw error;
    }
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
    /* Transfor the string (example: "February 16, 2023 at 02:01 PM") 
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
    yearSummary,
    getYearSummary,
    setYearSummary,
    totalOrders,
    loading,
    error,
  };
};

export default useZomatoScrapper;
