import React from 'react';
import { motion } from 'framer-motion';
import { Receipt, Store, MapPin, Coins } from 'lucide-react';
import { fmtInt, fmtINR } from '../../../helpers/format';

const Tile = ({ Icon, value, label, delay, tint }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    whileHover={{ y: -3, boxShadow: '0 14px 36px -16px rgba(61,31,20,0.28)' }}
    className="rounded-3xl bg-white shadow-card p-5 flex flex-col justify-between min-h-[160px]"
  >
    <div
      className="w-12 h-12 rounded-2xl flex items-center justify-center"
      style={{ background: tint }}
    >
      <Icon className="w-7 h-7" strokeWidth={2.2} color="#3D1F14" />
    </div>
    <div>
      <div className="font-display font-extrabold text-3xl sm:text-[36px] text-espresso-900 leading-none tabular-nums">
        {value}
      </div>
      <div className="text-espresso-800/60 text-sm mt-1">{label}</div>
    </div>
  </motion.div>
);

const MetricsGrid = ({ review, startDelay = 0 }) => {
  if (!review) {
    return (
      <div className="rounded-3xl bg-white shadow-card p-7 text-espresso-800/60 lg:col-span-4">
        No orders to summarise for this period.
      </div>
    );
  }
  const restaurants = review.total_restaurants || 0;
  const cities = review.all_cities?.length || 0;
  const avg = Math.round(Number(review.average_order_cost) || 0);
  const orders = review.total_orders || 0;

  return (
    <>
      <Tile
        Icon={Receipt}
        value={fmtInt(orders)}
        label="Total orders"
        delay={startDelay}
        tint="#FBE6D2"
      />
      <Tile
        Icon={Store}
        value={fmtInt(restaurants)}
        label="Restaurants"
        delay={startDelay + 0.06}
        tint="#FFE0E3"
      />
      <Tile
        Icon={MapPin}
        value={fmtInt(cities)}
        label="Cities"
        delay={startDelay + 0.12}
        tint="#FFE3BF"
      />
      <Tile
        Icon={Coins}
        value={fmtINR(avg)}
        label="Avg / order"
        delay={startDelay + 0.18}
        tint="#FFE6B0"
      />
    </>
  );
};

export default MetricsGrid;
