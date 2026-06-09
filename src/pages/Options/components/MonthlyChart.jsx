import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fmtInt } from '../../../helpers/format';

const fmt = (n) => fmtInt(n);
const compactINR = (n) => {
  const v = Number(n) || 0;
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(1)}Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(1)}L`;
  if (v >= 1e3) return `₹${(v / 1e3).toFixed(0)}k`;
  return `₹${v}`;
};

const OPTIONS = [
  { value: 'cost', label: 'Spend' },
  { value: 'orders', label: 'Order count' },
];

const MonthlyChart = ({ data, accent = '#E23744' }) => {
  const [metric, setMetric] = useState('cost');

  const TooltipBox = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const v = payload[0].value;
    return (
      <div className="rounded-2xl bg-espresso-900 text-cream-50 px-4 py-3 text-xs shadow-lg">
        <div className="font-semibold text-cream-50/70 uppercase tracking-wider text-[10px]">
          {label}
        </div>
        <div className="font-display font-bold text-lg mt-1">
          {metric === 'cost' ? `₹${fmt(v)}` : `${v} orders`}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Segmented toggle with a sliding pill behind the active option */}
      <LayoutGroup id="monthly-toggle">
        <div className="inline-flex bg-cream-200 rounded-full p-1 mb-4 text-xs font-semibold">
          {OPTIONS.map((opt) => {
            const active = metric === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setMetric(opt.value)}
                className="relative px-3.5 py-1.5 rounded-full transition-colors"
              >
                {active && (
                  <motion.span
                    layoutId="monthly-toggle-pill"
                    className="absolute inset-0 rounded-full bg-espresso-900"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    active ? 'text-cream-50' : 'text-espresso-800/70'
                  }`}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      {/* Remount the chart on metric change so Recharts replays its draw-in
          animation cleanly, wrapped in a fade for a smoother handoff. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={metric}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id={`grad-${accent}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={accent} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 6"
                stroke="#e8d9c1"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: '#5A2E1F', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#5A2E1F', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={60}
                tickFormatter={(v) => (metric === 'cost' ? compactINR(v) : v)}
              />
              <Tooltip
                content={<TooltipBox />}
                cursor={{
                  stroke: accent,
                  strokeWidth: 1,
                  strokeDasharray: '4 4',
                }}
              />
              <Area
                type="monotone"
                dataKey={metric}
                stroke={accent}
                strokeWidth={3}
                fill={`url(#grad-${accent})`}
                isAnimationActive
                animationDuration={1100}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MonthlyChart;
