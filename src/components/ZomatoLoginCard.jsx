import React, { useEffect, useState } from 'react';
import { ImSpinner8 } from "react-icons/im";


const ZomatoLoginCard = ({ onLoggedinZomato }) => {
  const [zomatoLoggedIn, setZomatoLoggedIn] = useState(false);
  const [zomatoChecked, setZomatoChecked] = useState(false);

  useEffect(() => {
    const checkZomatoLogin = async () => {
      const zomatoData = await fetch(
        'https://www.zomato.com/webroutes/user/orders'
      );
      const data = await zomatoData.json();
      console.log(data);

      if (data?.sections?.SECTION_USER_ORDER_HISTORY?.totalPages) {
        setZomatoLoggedIn(true);
        chrome.storage.local.set({
          zomatePages: data?.sections?.SECTION_USER_ORDER_HISTORY?.totalPages,
        });
        onLoggedinZomato();
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
          <div className="text-gray-700">
            {!zomatoChecked ? (
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
                    Please
                    <a
                      href="https://www.zomato.com/login"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 underline px-1 inline"
                    >
                      Login
                    </a>
                    to Zomato
                  </div>
                )}
              </>
            )}

            {}
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default ZomatoLoginCard;
