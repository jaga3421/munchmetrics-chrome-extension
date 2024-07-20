import React, { useEffect, useState } from 'react';
import ProgressBar from './ProgressBar';
import { ImSpinner8 } from "react-icons/im";


const NoEntryZomato = ({ collectData, loading, currentOrders }) => {
  const [zomatoLoggedIn, setZomatoLoggedIn] = useState(false);
  const [zomatoChecked, setZomatoChecked] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const checkZomatoLogin = async () => {
      const zomatoData = await fetch(
        'https://www.zomato.com/webroutes/user/orders'
      );
      const data = await zomatoData.json();
      console.log(data);
      if (data?.sections?.SECTION_USER_ORDER_HISTORY?.totalPages) {
        setZomatoLoggedIn(true);
        setTotalOrders(data?.sections?.SECTION_USER_ORDER_HISTORY?.count);
        chrome.storage.local.set({
          zomatePages: data?.sections?.SECTION_USER_ORDER_HISTORY.totalPages,
        });
      }
      setZomatoChecked(true);
    };
    checkZomatoLogin();
  }, []);

  return (
    <div className="flex-1">
      <div className="flex flex-col bg-white shadow rounded overflow-hidden ">
        <div
          className="bg-cover h-32"
          style={{
            backgroundPosition: 'center',

            backgroundImage:
              "url('https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png')",
          }}
        ></div>
        <div className="p-4 h-28 text-sm flex items-center relative">
          <p className="text-gray-700">
            {loading ? (
              <>
                <ProgressBar current={currentOrders} total={totalOrders} />
                <span className="text-sm px-2">
                  {currentOrders}/{totalOrders}{' '}
                </span>
              </>
            ) : !zomatoChecked ? (
              <div className='flex flex-row space-x-2 items-center'>
                  <ImSpinner8 className='animate-spin mr-2 text-red-600' />Checking Login status
              </div>
            ) : (
              <>
                {zomatoLoggedIn ? (
                  <div className="">
                    You are logged into Zomato
                    <div className='absolute bottom-2 right-2 animate-pulse rounded-full h-2 w-2 bg-green-700'></div>
                  </div>
                ) : (
                  <div className="block">
                    Please{' '}
                    <a
                      href="https://www.zomato.com/login"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 underline px-1 inline"
                    >
                      Login
                    </a>{' '}
                    to Zomato to get your stats
                  </div>
                )}
              </>
            )}

            {}
          </p>
          {/* {!loading && (
            <button
              className={`mt-4 bg-blue-500 text-white rounded px-3 py-1 ${
                zomatoLoggedIn ? '' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!zomatoLoggedIn}
              onClick={collectData}
            >
              Show my Expense
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default NoEntryZomato;
