function groupByYears(arr) {
  const yearObject = {};
  (arr || []).forEach((order) => {
    const year = order?.orderDate?.year;
    if (!year) return;
    if (!yearObject[year]) yearObject[year] = [];
    yearObject[year].push(order);
  });
  const sortedKeys = Object.keys(yearObject).sort(
    (a, b) => Number(b) - Number(a)
  );
  const out = {};
  sortedKeys.forEach((k) => (out[k] = yearObject[k]));
  return out;
}

function safeCost(order) {
  if (typeof order?.order_total === 'number') return order.order_total;
  if (typeof order?.order_total === 'string') {
    const n = parseFloat(order.order_total);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

function generateYearlyReview(yearSummary) {
  if (!Array.isArray(yearSummary) || !yearSummary.length) return null;

  const totalOrders = yearSummary.length;

  const totalCost = yearSummary.reduce((acc, o) => acc + safeCost(o), 0);

  const mostExpensiveOrder = yearSummary.reduce(
    (max, order) => {
      const cost = safeCost(order);
      return cost > max.cost ? { order, cost } : max;
    },
    { order: null, cost: 0 }
  );

  const leastExpensiveOrder = yearSummary.reduce(
    (min, order) => {
      const cost = safeCost(order);
      if (cost <= 0) return min;
      return cost < min.cost || min.cost === 0 ? { order, cost } : min;
    },
    { order: null, cost: 0 }
  );

  const averageOrderCost = totalOrders
    ? (totalCost / totalOrders).toFixed(2)
    : '0.00';

  const dishFrequency = yearSummary.reduce((acc, order) => {
    (order?.dishes || []).forEach((dish) => {
      if (dish && typeof dish === 'string' && dish.trim()) {
        acc[dish] = (acc[dish] || 0) + 1;
      }
    });
    return acc;
  }, {});

  const topDishes = Object.entries(dishFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  const restaurantFrequency = yearSummary.reduce((acc, order) => {
    const name = order?.restaurant_name;
    if (!name) return acc;
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const topRestaurants = Object.entries(restaurantFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const uniqueRestaurants = Object.keys(restaurantFrequency).length;

  const cityFrequency = yearSummary.reduce((acc, order) => {
    const city = order?.restaurant_city_name;
    if (!city) return acc;
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  const topCities = Object.entries(cityFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const allCities = Object.keys(cityFrequency);

  const timeSlotCount = {};
  yearSummary.forEach((order) => {
    const slot = order?.orderDate?.timeSlot;
    if (slot === undefined || slot === null) return;
    timeSlotCount[slot] = (timeSlotCount[slot] || 0) + 1;
  });
  const top10Time = Object.entries(timeSlotCount)
    .map(([hour, count]) => ({ hour: parseInt(hour, 10), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    total_orders: totalOrders,
    total_cost_spent: Number(totalCost.toFixed(2)),
    most_expensive_order: mostExpensiveOrder,
    least_expensive_order: leastExpensiveOrder,
    average_order_cost: averageOrderCost,
    top_dishes: topDishes,
    top_restaurants: topRestaurants,
    top_cities: topCities,
    all_cities: allCities,
    total_restaurants: uniqueRestaurants,
    top_10_time: top10Time,
  };
}

function groupOrdersByMonth(yearSummary) {
  const monthlyOrders = Array.from({ length: 12 }, () => []);
  (yearSummary || []).forEach((order) => {
    const m = order?.orderDate?.month;
    if (!m || m < 1 || m > 12) return;
    monthlyOrders[m - 1].push(order);
  });
  return monthlyOrders;
}

function readifyTimeSlot(hour) {
  if (hour === undefined || hour === null || hour < 0 || hour > 23) {
    return 'Unknown';
  }
  const isPM = hour >= 12;
  const ampmHour = hour % 12 || 12;
  const nextHour = (hour + 1) % 12 || 12;
  const isNextPM = isPM && nextHour !== 12;
  return `${ampmHour}:00 ${isPM ? 'PM' : 'AM'} - ${nextHour}:00 ${
    isNextPM ? 'PM' : 'AM'
  }`;
}

export {
  groupOrdersByMonth,
  generateYearlyReview,
  groupByYears,
  readifyTimeSlot,
};
