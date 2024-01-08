import React from 'react';
import { PieChart, Pie, Text, ResponsiveContainer, Tooltip } from 'recharts';

function HourChart({ top10Time }) {
  console.log(top10Time);
  return (
    <div className="w-1/3 p-2 bg-gray-100 border border-gray-200 rounded">
      <h3 className="mb-6">Hungry hours Top 10</h3>
      <ResponsiveContainer height={350}>
        <PieChart>
          <Pie
            data={top10Time}
            dataKey="count"
            nameKey="hour"
            cx="50%"
            cy="50%"
            innerRadius={60}
            label
          />
          <Text />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-row"></div>
    </div>
  );
}

export default HourChart;
