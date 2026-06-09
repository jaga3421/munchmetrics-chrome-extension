import React from 'react';
import { motion } from 'framer-motion';

const TopList = ({ items = [], accent = '#E23744', emptyLabel = 'Nothing to show yet.' }) => {
  if (!items.length)
    return <p className="text-espresso-800/60 text-sm">{emptyLabel}</p>;
  const max = items.reduce((m, i) => Math.max(m, i.count || 0), 0) || 1;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => {
        const pct = ((item.count / max) * 100).toFixed(0);
        return (
          <motion.li
            key={`${item.name}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.35, delay: 0.04 * i }}
            whileHover={{ x: 4 }}
            className="relative rounded-2xl bg-cream-100 px-4 py-3 overflow-hidden"
          >
            <div
              className="absolute inset-y-0 left-0 opacity-25"
              style={{ width: `${pct}%`, background: accent }}
            />
            <div className="relative flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-espresso-900 truncate">
                {i + 1}. {item.name || 'Unknown'}
              </span>
              <span className="text-xs font-semibold text-espresso-800/70 shrink-0">
                {item.count}×
              </span>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
};

export default TopList;
