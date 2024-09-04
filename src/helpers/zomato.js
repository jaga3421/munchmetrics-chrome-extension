/**
 * Generates the yearly review from the yearSummary Array
 * @param {*} yearSummary : collected from ZomataScrapper Hook
 */

function groupByYears(arr) {
  const yearObject = {};

  arr.forEach((order) => {
    const year = order.orderDate.year;

    if (yearObject[year]) {
      // If the year already exists, push the order to the existing array
      yearObject[year].push(order);
    } else {
      // If the year doesn't exist, create a new array with the order
      yearObject[year] = [order];
    }
  });
  let sortedKeys = Object.keys(yearObject).sort((a, b) => b.localeCompare(a));
  // Create a new object with sorted key-value pairs
  let sortedObject = {};
  sortedKeys.forEach((key) => {
    sortedObject[key] = yearObject[key];
  });

  return sortedObject;
}

function generateYearlyReview(yearSummary) {
  const totalOrders = yearSummary?.length;

  // Total cost spent
  const totalCost = yearSummary?.reduce((acc, order) => {
    const cost = parseFloat(order.totalCost.replace('₹', ''));
    return acc + cost;
  }, 0);

  // Most expensive order
  const mostExpensiveOrder = yearSummary?.reduce(
    (maxOrder, order) => {
      const cost = parseFloat(order.totalCost.replace('₹', ''));
      return cost > maxOrder.cost ? { order, cost } : maxOrder;
    },
    { order: null, cost: 0 }
  );

  // Least expensive order
  const leastExpensiveOrder = yearSummary.reduce(
    (minOrder, order) => {
      const cost = parseFloat(order.totalCost.replace('₹', ''));
      return cost < minOrder.cost || minOrder.cost === 0
        ? { order, cost }
        : minOrder;
    },
    { order: null, cost: 0 }
  );

  // Average order cost
  const averageOrderCost = (totalCost / totalOrders).toFixed(2);

  // Top dishes
  const dishFrequency = yearSummary.reduce((acc, order) => {
    order.dishes.forEach((dish) => {
      if (!!dish && dish.trim() != '' && dish != null)
        acc[dish] = (acc[dish] || 0) + 1;
    });
    return acc;
  }, {});

  const topDishes = Object.entries(dishFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  // Top restaurants
  const restaurantFrequency = yearSummary.reduce((acc, order) => {
    const restaurantId = order.resInfo.id;
    acc[restaurantId] = (acc[restaurantId] || 0) + 1;
    return acc;
  }, {});
  const topRestaurants = Object.entries(restaurantFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, count]) => ({
      resInfo: yearSummary.find((order) => order.resInfo.id === parseInt(id))
        .resInfo,
      count,
    }));

  // count of unique resInfo based on resInfo.id
  const uniqueRestaurants = new Set(
    yearSummary.map((order) => order.resInfo.id)
  ).size;

  // Top cities
  const cityFrequency = yearSummary.reduce((acc, order) => {
    const cityName = getCityName(order.resInfo.locality.localityName);
    acc[cityName] = (acc[cityName] || 0) + 1;
    return acc;
  }, {});
  const topCities = Object.entries(cityFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  // All cities
  const allCities = Array.from(
    new Set(yearSummary.map((order) => getCityName(order.resInfo.locality.localityName)))
  );

  // All years

  const allYears = Array.from(
    new Set(yearSummary.map((order) => Number(order.orderDate.year)))
  ).sort((a, b) => b - a);

  const getTop10TimeSlots = (orderArray) => {
    const timeSlotCount = {};

    orderArray.forEach((order) => {
      const timeSlot = order.orderDate.timeSlot;
      timeSlotCount[timeSlot] = (timeSlotCount[timeSlot] || 0) + 1;
    });

    // Convert the object into an array of {hour, count} objects and sort in descending order
    const timeSlotArray = Object.entries(timeSlotCount)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count);

    // Slice the array to get the top 10 elements
    const top10TimeSlots = timeSlotArray.slice(0, 10);

    return top10TimeSlots;
  };

  const top10Time = getTop10TimeSlots(yearSummary);

  // Construct the analytics object
  const analytics = {
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

  console.log(analytics)
  return analytics;
}

function getCityName(name) {
  let split = name.split(', ');
  return split.length == 1 ? name : split[split.length - 1]
}

function groupOrdersByMonth(yearSummary) {
  // Initialize an array to hold 12 months
  const monthlyOrders = Array.from({ length: 12 }, () => []);

  // Process each order in the yearSummary
  yearSummary.forEach((order) => {
    // Extract month from the orderDate
    let month;
    if (typeof order.orderDate === 'string') {
      const orderDate = new Date(order.orderDate.replace(' at', ''));
      month = orderDate.getMonth();
    } else {
      month = order.orderDate.month - 1;
    }

    // Push the order to the corresponding month
    monthlyOrders[month].push(order);
  });

  return monthlyOrders;
}

function readifyTimeSlot(hour) {
  if (hour < 0 || hour > 23) {
    return 'Invalid hour';
  }

  const isPM = hour >= 12;
  const ampmHour = hour % 12 || 12; // Convert 0 to 12 for midnight
  const nextHour = (hour + 1) % 12 || 12; // Calculate the next hour

  const timeString = `${ampmHour}:00 ${isPM ? 'PM' : 'AM'} - ${nextHour}:00 ${
    isPM && nextHour !== 12 ? 'PM' : 'AM'
  }`;

  return timeString;
}

export {
  groupOrdersByMonth,
  generateYearlyReview,
  groupByYears,
  readifyTimeSlot,
};
// Export statements are not needed in JavaScript.
