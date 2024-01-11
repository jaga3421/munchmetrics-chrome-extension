import React from 'react';
import CardComponent from './CardComponent';

import { FaIndianRupeeSign } from 'react-icons/fa6';
import { GrRestaurant } from 'react-icons/gr';
import { FaTreeCity } from 'react-icons/fa6';
import { MdOutlineFastfood } from 'react-icons/md';
import { motion } from 'framer-motion';

function formatNumber(num) {
  // Format according to the Indian numbering system
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(
    num
  );
}

function CardHolder({ yearReview }) {
  const { total_cost_spent, total_restaurants, total_orders, all_cities } =
    yearReview;
  return (
    <div className="card-content-wrapper p-4 flex space-x-2">
      <motion.div
        className="flex-1"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <CardComponent
          icon={<FaIndianRupeeSign />}
          subText="Total Food expenses"
          mainText={formatNumber(total_cost_spent)}
        />
      </motion.div>

      <motion.div
        className="flex-1"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CardComponent
          icon={<GrRestaurant />}
          mainText={total_restaurants}
          subText="Enjoyed from Restaurants"
        />
      </motion.div>

      <motion.div
        className="flex-1"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <CardComponent
          icon={<MdOutlineFastfood />}
          subText="Total Orders"
          mainText={total_orders}
        />
      </motion.div>

      <motion.div
        className="flex-1"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <CardComponent
          icon={<FaTreeCity />}
          subText="Places ordered from"
          mainText={all_cities.length}
        />
      </motion.div>
    </div>
  );
}

export default CardHolder;
