import React from 'react';
import CardComponent from './CardComponent';

import { FaIndianRupeeSign } from 'react-icons/fa6';
import { GrRestaurant } from 'react-icons/gr';
import { FaTreeCity } from 'react-icons/fa6';
import { MdOutlineFastfood } from 'react-icons/md';

function CardHolder({ yearReview }) {
  const { total_cost_spent, total_restaurants, total_orders, all_cities } =
    yearReview;
  return (
    <div className="card-content-wrapper p-4 flex space-x-2">
      <CardComponent
        icon={<FaIndianRupeeSign />}
        subText="Total Food expenses"
        mainText={total_cost_spent}
      />
      <CardComponent
        icon={<GrRestaurant />}
        mainText={total_restaurants}
        subText="Enjoyed from Restaurants"
      />
      <CardComponent
        icon={<MdOutlineFastfood />}
        subText="Total Orders"
        mainText={total_orders}
      />
      <CardComponent
        icon={<FaTreeCity />}
        subText="Places ordered from"
        mainText={all_cities.length}
      />
    </div>
  );
}

export default CardHolder;
