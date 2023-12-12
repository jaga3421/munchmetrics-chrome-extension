import React from "react";

const MiniStats = ({ data }) => {
  return (
    <div className="bg-gray-100">
      <div className="py-10 text-gray-500 max-w-6xl mx-auto">
        <div className="text-center md:text-left md:flex flex-wrap">
          <div className="w-full md:w-1/3 p-4 text-xl">
            {/* Micro Stats */}
            <div className="mb-1 flex justify-center">
              <div className="mb-2 text-green-500 font-light text-right">
                Your total orders
              </div>
              <div className="font-bold  px-2">{data.total_orders}</div>
            </div>

            <div className="mb-1 flex justify-center">
              <div className="mb-2 text-green-500 font-light text-right">
                Restaurents you ordered from
              </div>
              <div className="font-bold  px-2">
                {data.top_restaurants?.length}
              </div>
            </div>

            <div className="mb-1 flex justify-center">
              <div className="mb-2 text-green-500 font-light text-right">
                Cities you enjoyed your food
              </div>
              <div className="font-bold  px-2">{data.all_cities?.length}</div>
            </div>
          </div>

          {/* Food */}
          <div className="w-full md:w-1/3 p-4 text-center flex flex-col justify-center ">
            <h2 className="text-lg font-light  mb-2 text-green-500">
              Your Favorite Food
            </h2>
            <p className="text-2xl font-semibold mb-2">
              {data?.top_dishes[0].name}
            </p>
            <p className="text-xs uppercase text-gray-400">
              Ordered {data.top_dishes[0].count} times
            </p>
          </div>

          {/* Restaurent */}
          <div className="w-full md:w-1/3 p-4 text-center flex flex-col justify-center">
            <h2 className="text-lg font-light  mb-2 text-green-500">
              Your Favorite Establishment
            </h2>
            <p className="text-2xl font-semibold mb-2">
              {data.top_restaurants[0].resInfo.name}{" "}
            </p>
            <p className="text-xs uppercase text-gray-400">
              Ordered {data.top_restaurants[0].count} times
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniStats;
