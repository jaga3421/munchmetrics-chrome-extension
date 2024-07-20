import React, { useEffect, useState } from 'react';
import { ImSpinner8 } from "react-icons/im";

const NoEntrySwiggy = ({ loading }) => {
  const [swiggyLoggedIn, setSwiggyLoggedIn] = useState(false);
  const [swiggyChecked, setSwiggyChecked] = useState(false);


  useEffect(() => {
    const checkSwiggyLogin = async () => {
      const swiggyData = await fetch(
        'https://www.swiggy.com/dapi/order/all?order_id'
      );
      const data = await swiggyData.json();
      console.log(data);
      if (data.statusCode === 0) {
        setSwiggyLoggedIn(true);
      }
      setSwiggyChecked(true);
    };
    checkSwiggyLogin();
  }, []);

  return (
    <div className="flex-1">
      <div className="flex flex-col bg-white shadow rounded overflow-hidden ">
        <div
          className="h-32 bg-cover"
          style={{
            backgroundPosition: 'center',

            backgroundImage:
              "url('https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png')",
          }}
        ></div>
        <div className="p-4 h-28 text-sm flex items-center relative">
          <p className="text-gray-700">
            {loading ? (
              'loading'
            ) : !swiggyChecked ? (
              <div className='flex flex-row space-x-2 items-center'>
                  <ImSpinner8 className='animate-spin mr-2 text-orange-600' />Checking Login status
              </div>
            ) : (
              <>
                {swiggyLoggedIn ? (
                  <div className="">
                    You are logged into Swiggy
                    <div className='absolute bottom-2 right-2 animate-pulse rounded-full h-2 w-2 bg-green-700'></div>
                  </div>
                ) : (
                  <div className="block">
                    Please{' '}
                    <a
                      href="https://www.swiggy.com/auth"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 underline px-1 inline"
                    >
                      Login
                    </a>{' '}
                    to Swiggy to get your expenses
                  </div>
                )}
              </>
            )}

            {}
          </p>
         
        </div>
      </div>
    </div>
  );
};

export default NoEntrySwiggy;
