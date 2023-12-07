/***
 * These are the functions that will scrap the url and get details about food ordered
 */

const getYearSummary = async (page = 1, resultArray = []) => {
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
      const orderDate = orders[orderId].orderDate;

      if (orderDate.includes('2023')) {
        const summaryObject = {
          ...orders[orderId],
          dishes: processDishString(orders[orderId].dishString),
        };
        resultArray.push(summaryObject);
      } else if (orderDate.includes('2022')) {
        return; // Exit the forEach loop if orderDate contains 2022
      }
    });

    if (
      resultArray.some((obj) =>
        Object.values(obj)[0].orderDate?.includes('2022')
      )
    ) {
      return resultArray;
    }

    // Continue the recursion only if there are more pages
    const userOrderHistory = data.sections.SECTION_USER_ORDER_HISTORY;
    if (userOrderHistory.currentPage <= userOrderHistory.totalPages) {
      return await getYearSummary(
        userOrderHistory.currentPage + 1,
        resultArray
      );
    } else {
      return resultArray;
    }
  } catch (error) {
    console.error('Error in getYearSummary:', error);
    throw error;
  }
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
};

function generateYearlyReview(yearSummary) {
  const totalOrders = yearSummary.length;

  // Total cost spent
  const totalCost = yearSummary.reduce((acc, order) => {
    const cost = parseFloat(order.totalCost.replace('₹', ''));
    return acc + cost;
  }, 0);

  // Cost per month
  const costPerMonth = (totalCost / 12).toFixed(2);

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

  // Construct the analytics object
  const analytics = {
    total_orders: totalOrders,
    total_cost_spent: `₹${totalCost.toFixed(2)}`,
    cost_per_month: `₹${costPerMonth}`,
    most_expensive_order: mostExpensiveOrder,
    least_expensive_order: leastExpensiveOrder,
    average_order_cost: `₹${averageOrderCost}`,
    top_dishes: topDishes,
    top_restaurants: topRestaurants,
    top_cities: topCities,
    all_cities: allCities,
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

export { getYearSummary, groupOrdersByMonth, generateYearlyReview };
