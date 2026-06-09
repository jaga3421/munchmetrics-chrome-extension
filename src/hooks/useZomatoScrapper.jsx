import { useState } from 'react';

const useZomatoScrapper = () => {
  const [yearSummary, setYearSummary] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (pageNumber, track) => {
    try {
      const response = await fetch(
        `https://www.zomato.com/webroutes/user/orders?page=${pageNumber}`
      );
      const data = await response.json();

      if (data?.sections?.SECTION_USER_ORDER_HISTORY?.count !== undefined) {
        setTotalOrders(data.sections.SECTION_USER_ORDER_HISTORY.count);
      }
      if (track && data?.entities?.ORDER) {
        setCurrentPage(
          (prev) => prev + Object.keys(data.entities.ORDER).length
        );
      }
      return data;
    } catch (err) {
      console.error(`Error fetching data for page ${pageNumber}:`, err);
      throw err;
    }
  };

  const getYearSummary = () =>
    new Promise((resolve, reject) => {
      setLoading(true);
      setError(null);
      chrome.storage.local.get('zomatePages', async (res) => {
        const totalPages = res.zomatePages;
        if (!totalPages) {
          setLoading(false);
          resolve([]);
          return;
        }

        const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
        try {
          const results = await Promise.all(
            pagesArray.map((p) => fetchData(p, true))
          );
          const summary = [];
          results.forEach((result) => {
            const orders = result?.entities?.ORDER || {};
            Object.keys(orders).forEach((orderId) => {
              const order = orders[orderId];
              try {
                summary.push({
                  ...order,
                  dishes: processDishString(order.dishString || ''),
                  orderDate: processOrderDate(order.orderDate),
                });
              } catch (e) {
                // skip malformed
              }
            });
          });
          const cleaned = summary.filter((o) => o.orderDate);
          setLoading(false);
          setYearSummary(cleaned);
          resolve(cleaned);
        } catch (err) {
          setLoading(false);
          setError(err);
          reject(err);
        }
      });
    });

  function processDishString(dishString) {
    if (!dishString || typeof dishString !== 'string') return [];
    const dishesArray = dishString.split(',').map((item) => item.trim());
    const dishNames = dishesArray.map((item) => {
      const parts = item.split('x');
      const count = parseInt(parts[0].trim()) || 1;
      const dishName = parts[1]?.trim();
      if (!dishName) return [];
      return Array(count).fill(dishName);
    });
    return [].concat(...dishNames);
  }

  function processOrderDate(orderDate) {
    if (!orderDate || typeof orderDate !== 'string') return null;
    const date = new Date(orderDate.replace(' at', ''));
    if (isNaN(date.getTime())) return null;
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      timeSlot: date.getHours(),
    };
  }

  return {
    zomatoYearSummary: yearSummary,
    getZomatoYearSummary: getYearSummary,
    setZomatoYearSummary: setYearSummary,
    zomatoCurrentPage: currentPage,
    zomatoTotalOrders: totalOrders,
    zomatoLoading: loading,
    zomatoError: error,
  };
};

export default useZomatoScrapper;
