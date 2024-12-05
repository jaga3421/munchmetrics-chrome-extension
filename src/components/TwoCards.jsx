import React from 'react';
import SwiggyLoginCard from './SwiggyLoginCard';
import ZomatoLoginCard from './ZomatoLoginCard';
import { ImSpinner8 } from "react-icons/im";

const TwoCards = ({ 
  onLoggedinZomato, 
  onLoggedinSwiggy, 
  totalOrdersZomato, 
  totalOrdersSwiggy, 
  navigateToMain,
  zomatoLoading,
  SwiggyLoading,
}) => {
  return (
    <>
      <div className='flex flex-row space-x-2'>
        <ZomatoLoginCard
          onLoggedinZomato={onLoggedinZomato}
        />
        <SwiggyLoginCard 
          onLoggedinSwiggy={onLoggedinSwiggy}
        />
      </div>

      <div className='mt-6'>
        {
          (totalOrdersZomato || totalOrdersSwiggy) ? 
            (
              <div className='my-12 text-center'>
                {
                  true ?
                  <div className='flex items-center space-x-2 justify-center'><span >Zomato orders processed (Lifetime):</span>{!totalOrdersZomato || zomatoLoading ? <ImSpinner8 className='inline-block ml-[5px] animate-spin text-red-600' /> : totalOrdersZomato}</div> : 
                  ''
                }
                 {
                  true ?
                  <div>Swiggy orders processed (2024): {SwiggyLoading ? 'Calculating...' : totalOrdersSwiggy}</div>  : ''
                }
                
                <button className='p-2 mt-2  bg-gray-600 text-white rounded' onClick={navigateToMain}>Show My Expenses</button>
              </div>
            )
            : <div className='my-12 '>{
              (zomatoLoading || SwiggyLoading) ? (<div className='flex flex-row space-x-2 items-center justify-center'>
                            <ImSpinner8 className='animate-spin mr-2 text-red-600' />Getting your Expenses
                          </div>) 
                        : ''}
              </div>
        }
      </div>
    </>
  );
};

export default TwoCards;
