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
          dishes: (item.order_items || []).map(dish => dish.name),
          orderDate: processOrderDate(
            item.payment_txn_created_on ||
              item.order_placement_status_updated_at ||
              item.order_time
          ),
        })).filter(item => item.orderDate)
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
    if (!orderDate || typeof orderDate !== 'string') return null;

    let date;
    if (orderDate.includes(' ')) {
      const [datePart, timePart] = orderDate.split(' ');
      date = new Date(`${datePart}T${timePart}`);
    } else {
      date = new Date(orderDate);
    }
    if (isNaN(date.getTime())) return null;

    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      timeSlot: date.getHours(),
    };
  }

  return {
    yearSummarySwiggy,
    getYearSummarySwiggy,
    setYearSummarySwiggy,
    currentPage,
    totalOrdersSwiggy,
    swiggyLoading: loading,
    swiggyError: error,
  };
};

export default useSwiggyScrapper;
