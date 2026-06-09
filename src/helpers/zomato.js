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
  const raw = order?.totalCost;
  if (typeof raw === 'number') return raw;
  if (typeof raw === 'string') {
    const n = parseFloat(raw.replace(/[₹,\s]/g, ''));
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

function getCityName(name) {
  if (!name || typeof name !== 'string') return 'Unknown';
  const split = name.split(', ');
  return split.length === 1 ? name : split[split.length - 1];
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
    const id = order?.resInfo?.id;
    if (id === undefined || id === null) return acc;
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  const topRestaurants = Object.entries(restaurantFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, count]) => {
      const match = yearSummary.find(
        (o) => String(o?.resInfo?.id) === String(id)
      );
      return { resInfo: match?.resInfo || { name: 'Unknown' }, count };
    });

  const uniqueRestaurants = Object.keys(restaurantFrequency).length;

  const cityFrequency = yearSummary.reduce((acc, order) => {
    const city = getCityName(order?.resInfo?.locality?.localityName);
    if (!city || city === 'Unknown') return acc;
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  const topCities = Object.entries(cityFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  const allCities = Object.keys(cityFrequency);

  const allYears = Array.from(
    new Set(yearSummary.map((o) => Number(o?.orderDate?.year)).filter(Boolean))
  ).sort((a, b) => b - a);

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
    all_years: allYears,
    total_restaurants: uniqueRestaurants,
    top_10_time: top10Time,
  };
}

function groupOrdersByMonth(yearSummary) {
  const monthlyOrders = Array.from({ length: 12 }, () => []);
  (yearSummary || []).forEach((order) => {
    let month;
    if (typeof order?.orderDate === 'string') {
      const d = new Date(order.orderDate.replace(' at', ''));
      if (isNaN(d.getTime())) return;
      month = d.getMonth();
    } else {
      const m = order?.orderDate?.month;
      if (!m || m < 1 || m > 12) return;
      month = m - 1;
    }
    monthlyOrders[month].push(order);
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
