import { useState } from 'react';
const URL = 'https://www.swiggy.com/dapi/order/all?order_id='

const useSwiggyScrapper = () => {
  const [yearSummarySwiggy, setYearSummarySwiggy] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalOrdersSwiggy, setTotalOrdersSwiggy] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  let summary = [];


  const fetchData = async (orderNumber, accumulatedOrders = []) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${URL}${orderNumber}`
      );
      const { data } = await response.json();
  
      let processedOrders = data.orders;
  
      if (processedOrders.length) {
        processedOrders = processedOrders.map(item => ({
          ...item,
          dishes: item.order_items.map(dish=>dish.name),
          orderDate: processOrderDate(item.payment_txn_created_on)
        }))
        setTotalOrdersSwiggy(accumulatedOrders.length + processedOrders.length);
        accumulatedOrders.push(...processedOrders);
        const lastOrderId = processedOrders[processedOrders.length - 1]?.order_id;
        return fetchData(lastOrderId, accumulatedOrders);
      } else {
        return accumulatedOrders;
      }
    } catch (error) {
      setLoading(false);
      setError(error);
      console.error(`Error fetching data for order ${orderNumber}:`, error);
      throw error;
    }
  };

  const getYearSummarySwiggy = async () => {
    const results = await fetchData('');
    setLoading(false);
    setYearSummarySwiggy(results);
    return results;

  }


  function processOrderDate(orderDate) {
    let onlyDate = orderDate.split(' ');
    const date = new Date(onlyDate[0]);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-11
    const day = date.getDate();
    const timeSlot = date.getHours(); // 24-hour format
  
    return { year, month, day, timeSlot };
  }

  return {
    yearSummarySwiggy,
    getYearSummarySwiggy,
    setYearSummarySwiggy,
    currentPage,
    totalOrdersSwiggy,
    loading,
    error,
  };
};

export default useSwiggyScrapper;
