import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

function MonthsChart({ monthWise }) {
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
      total += parseFloat(orders.totalCost.replace('₹', ''));
    });
    return total;
  };

  const onYSelect = (e) => {
    setCurrentY(e.target.value);
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
    <div className="w-4/6 p-2 bg-gray-100 border border-gray-200 rounded">
      <h3 className="mb-6">2023 Breakup</h3>
      {/* graph */}
      <LineChart width={800} height={300} data={monthData}>
        <Line type="monotone" dataKey={currentY} stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
      </LineChart>

      {/* Controls */}
      <div className="flex flex-row mt-6">
        <select name="changeProps" id="" onChange={onYSelect}>
          <option value={'cost'}>Cost</option>
          <option value={'times'}>Times</option>
        </select>
      </div>
    </div>
  );
}

export default MonthsChart;
