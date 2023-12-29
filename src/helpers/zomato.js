/**
 * Generates the yearly review from the yearSummary Array
 * @param {*} yearSummary : collected from ZomataScrapper Hook
 */

function generateYearlyReview(yearSummary) {
  const totalOrders = yearSummary.length;

  // Total cost spent
  const totalCost = yearSummary.reduce((acc, order) => {
    const cost = parseFloat(order.totalCost.replace('₹', ''));
    return acc + cost;
  }, 0);

  // Most expensive order
  const mostExpensiveOrder = yearSummary.reduce(
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
    const cityName = order.resInfo.locality.localityName;
    acc[cityName] = (acc[cityName] || 0) + 1;
    return acc;
  }, {});
  const topCities = Object.entries(cityFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  // All cities
  const allCities = Array.from(
    new Set(yearSummary.map((order) => order.resInfo.locality.localityName))
  );

  // All years

  const allYears = Array.from(
    new Set(yearSummary.map((order) => Number(order.orderDate.year)))
  ).sort((a, b) => b - a);

  // Construct the analytics object
  const analytics = {
    total_orders: totalOrders,
    total_cost_spent: totalCost.toFixed(2),
    most_expensive_order: mostExpensiveOrder,
    least_expensive_order: leastExpensiveOrder,
    average_order_cost: averageOrderCost,
    top_dishes: topDishes,
    top_restaurants: topRestaurants,
    top_cities: topCities,
    all_cities: allCities,
    all_years: allYears,
    total_restaurants: uniqueRestaurants,
  };

  return analytics;
}

function groupOrdersByMonth(yearSummary) {
  // Initialize an array to hold 12 months
  const monthlyOrders = Array.from({ length: 12 }, () => []);

  // Process each order in the yearSummary
  yearSummary.forEach((order) => {
    // Extract month from the orderDate
    const orderDate = new Date(order.orderDate.replace(' at', ''));
    const month = orderDate.getMonth();

    // Push the order to the corresponding month
    monthlyOrders[month].push(order);
  });

  return monthlyOrders;
}

export { groupOrdersByMonth, generateYearlyReview };
// Export statements are not needed in JavaScript.
