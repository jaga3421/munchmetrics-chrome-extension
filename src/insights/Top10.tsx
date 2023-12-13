import React from "react";
interface Props {
  data: any;
}

function Top10({ data }: Props) {
  return (
    <div className="container mx-auto max-w-4xl p-3 mt-5 md:flex">
      {/* Card component */}
      <div className="bg-white rounded shadow-md md:w-1/2 px-3 py-5 m-1 mb-3">
        <div className="flex flex-col">
          <div className="flex flex-col p-2">
            <span className="text-2xl text-gray-400 mb-4">
              Top Food enjoyed
            </span>
            {data.top_dishes.map((dish: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; count: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
              <div key={index}>
                <span className="text-md text-gray-600 md:text-sm">
                  {dish.name}{" "}
                </span>
                <span className="text-xs  text-gray-400">{dish.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Card component */}
      <div className="bg-white rounded shadow-md md:w-1/2 px-3 py-5 m-1 mb-3">
        <div className="flex flex-col">
          <div className="flex flex-col p-2">
            <span className="text-2xl  text-gray-400 mb-4">
              Top Establishments sought
            </span>
            {data.top_restaurants.map((restaurants: { resInfo: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }; count: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
              <div key={index}>
                <span className="text-md text-gray-600 md:text-sm">
                  {restaurants.resInfo.name}{" "}
                </span>
                <span className="text-xs  text-gray-400">
                  {restaurants.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Top10;
