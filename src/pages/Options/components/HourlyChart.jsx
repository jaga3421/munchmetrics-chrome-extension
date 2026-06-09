import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Compact hour label. 0 -> "12a", 13 -> "1p", etc.
const fmtHour = (h) => {
  if (h === 0) return '12a';
  if (h < 12) return `${h}a`;
  if (h === 12) return '12p';
  return `${h - 12}p`;
};

// Long form for tooltip: "9:00 PM - 10:00 PM"
const fmtRange = (h) => {
  const ampm = (x) =>
    `${((x + 11) % 12) + 1}:00 ${x >= 12 ? 'PM' : 'AM'}`;
  const next = (h + 1) % 24;
  return `${ampm(h)} - ${ampm(next)}`;
};

const HourlyChart = ({ data, accent = '#FC8019' }) => {
  const max = data.reduce((m, d) => Math.max(m, d.count || 0), 0) || 1;

  const TooltipBox = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload;
    const total = data.reduce((s, d) => s + d.count, 0) || 1;
    const pct = ((p.count / total) * 100).toFixed(0);
    return (
      <div className="rounded-2xl bg-espresso-900 text-cream-50 px-4 py-3 text-xs shadow-lg">
        <div className="font-semibold text-cream-50/70 uppercase tracking-wider text-[10px]">
          {fmtRange(p.hour)}
        </div>
        <div className="font-display font-bold text-lg mt-1">
          {p.count} orders
        </div>
        <div className="text-cream-50/60 text-[11px]">{pct}% of your year</div>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 8, left: -16, bottom: 0 }}
        barCategoryGap={2}
      >
        <XAxis
          dataKey="hour"
          tick={{ fill: '#5A2E1F', fontSize: 11 }}
          tickFormatter={fmtHour}
          interval={2}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#5A2E1F', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={36}
          allowDecimals={false}
        />
        <Tooltip
          content={<TooltipBox />}
          cursor={{ fill: 'rgba(252, 128, 25, 0.08)' }}
        />
        <Bar
          dataKey="count"
          radius={[6, 6, 0, 0]}
          isAnimationActive
          animationDuration={1100}
          animationEasing="ease-out"
        >
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={accent}
              fillOpacity={0.3 + (entry.count / max) * 0.7}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HourlyChart;
