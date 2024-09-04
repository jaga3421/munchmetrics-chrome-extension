import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function MonthsChart({ monthWise, currentYear }) {
  const months_object = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec',
  };

  const [monthData, setMonthData] = useState([]);
  const [currentY, setCurrentY] = useState('cost');

  const getTotalCost = (monthly) => {
    let total = 0;
    monthly.forEach((orders) => {
      if(orders.order_total) total+= orders.order_total
      else total += parseFloat(orders.totalCost.replace('₹', ''));
    });
    return total;
  };

  const onYSelect = (e) => {
    setCurrentY(e.target.value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      let message = '';
      if (payload[0].name === 'times') {
        if (payload[0].value === 0) {
          message = `You did not order in the month of ${label} 😢`;
        } else if (payload[0].value === 1) {
          message = `You ordered only once in the month of ${label} 🤭`;
        } else {
          message = `You ordered ${payload[0].value} times in the month of ${label} 👍🏼`;
        }
      } else {
        message = `You spent ₹${parseFloat(payload[0].value).toFixed(
          2
        )} in the month of ${label}`;
      }

      return (
        <div className="p-3 bg-zomato-500 text-zomato-100 text-xs rounded">
          <p>{message}</p>
        </div>
      );
    }

    return null;
  };
  useEffect(() => {
    const graphData = Object.keys(monthWise).map((i) => {
      return {
        month: months_object[i],
        times: monthWise[i].length,
        cost: getTotalCost(monthWise[i]),
      };
    });

    setMonthData(graphData);
  }, [monthWise]);

  return (
    <motion.div
      className="w-full p-4"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <div className="p-4 bg-zomato-200 border border-zomato-300 rounded">
        <div className="flex flex-row space-x-2 mb-8 justify-between">
          <h3 className="font-semibold text-zomato-800">
            Monthwise Breakup
            {currentYear === 'all' ? (
              <span className="text-xs text-zomato-600">
                {' '}
                (Choose Year to see monthwise breakup)
              </span>
            ) : (
              <span className="text-md font-bold text-zomato-700">
                {' '}
                {currentYear}
              </span>
            )}
          </h3>
          <select
            className=" bg-gray-200 border border-gray-300 rounded text-xs px-2 py-1 h-auto"
            name="changeProps"
            id=""
            onChange={onYSelect}
            disabled={currentYear === 'all'}
          >
            <option value={'cost'}>Cost</option>
            <option value={'times'}>Times</option>
          </select>
        </div>

        {/* graph */}
        <ResponsiveContainer width={'100%'} height={300}>
          <LineChart data={monthData}>
            <Line type="monotone" dataKey={currentY} stroke="#E03546" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={CustomTooltip} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default MonthsChart;
