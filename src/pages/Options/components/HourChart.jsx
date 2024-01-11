import { motion } from 'framer-motion';
import React from 'react';

import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomizedAxisTick = ({ x, y, payload }) => {
  // Extract the start time from the interval
  const startTime = payload.value.split(' - ')[0];

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        fontSize="10" // xs font size
      >
        {startTime}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-gray-200 rounded">
        <p className="text-sm text-gray-700">
          {`You ordered ${payload[0].value} times`}
          <br />
          {`between ${label}`}
        </p>
      </div>
    );
  }

  return null;
};

function HourChart({ top10Time }) {
  return (
    <motion.div
      className="p-4 bg-zomato-200 border border-zomato-300 rounded w-2/3"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.75 }}
    >
      <h3 className="mb-6 text-zomato-800 font-semibold">
        Hungry hours Top 10
      </h3>
      <ResponsiveContainer height={300} width={'100%'}>
        <BarChart
          data={top10Time}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="hour" tick={CustomizedAxisTick} interval={0} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            fill="#E55866"
            activeBar={<Rectangle fill="#8F1622" stroke="#E03546" />}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-row"></div>
    </motion.div>
  );
}

export default HourChart;
