import React from "react";
import HeroAnimation from "./HeroAnimation";

function Hero({ data }) {
  return (
    <div className="container bg-white-100 mx-auto max-w-6xl p-1 md:p-6 pt-12 block md:flex md:justify-between md:items-center">
      {/* Hero animation */}
      <div className="md:w-1/2">
        <HeroAnimation />
      </div>

      {/* Hero Expense */}
      <div className="md:w-1/2 text-center md:text-left px-2">
        <p className="text-xs text-gray-500">Hi JJay</p>
        <h1 className="text-2xl font-bold text-gray-500 mb-4">
          <span className="font-normal  uppercase">Your expense in </span>
          <span className="font-semibold">2023</span>
        </h1>
        <p className=" text-6xl md:text-8xl font-bold mb-6">
          <span className="text-green-600 font-normal  uppercase">₹ </span>
          <span className="text-green-500 font-semibold">
            {data.total_cost_spent}
          </span>
        </p>
        <p className="text-gray-400 text-xs mb-3">Ordered from Zomato</p>
      </div>
    </div>
  );
}

export default Hero;
