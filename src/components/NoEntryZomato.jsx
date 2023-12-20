import React, { useEffect, useState } from 'react';
import ProgressBar from './ProgressBar';

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
      }
      setZomatoChecked(true);
    };
    checkZomatoLogin();
  }, []);

  return (
    <div className="flex flex-col bg-blue-50 mb-3">
      <div className="flex bg-white shadow rounded overflow-hidden ">
        <div
          className="w-1/3 bg-cover"
          style={{
            backgroundPosition: 'center',

            backgroundImage:
              "url('https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png')",
          }}
        ></div>
        <div className="w-2/3 p-4">
          <p className="text-gray-700 text-sm flex items-center min-h-[60px]">
            {loading ? (
              <>
                <ProgressBar current={currentOrders} total={totalOrders} />
                <span className="text-sm px-2">
                  {currentOrders}/{totalOrders}{' '}
                </span>
              </>
            ) : !zomatoChecked ? (
              'Please wait'
            ) : (
              <>
                {zomatoLoggedIn ? (
                  <span className="inline">
                    You have ordered{' '}
                    <span className="font-semibold">{totalOrders}</span> times
                    from Zomato{' '}
                  </span>
                ) : (
                  <div className="block">
                    Please{' '}
                    <a
                      href="https://www.zomato.com/"
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
          {!loading && (
            <button
              className={`mt-4 bg-blue-500 text-white rounded px-3 py-1 ${
                zomatoLoggedIn ? '' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!zomatoLoggedIn}
              onClick={collectData}
            >
              Show my Expense
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoEntryZomato;
