import React from 'react';
import { formatINR } from '../helpers/formatINR';

function HomeExpense({
    zExpense = 0,
    sExpense = 0
}) {
  const totalExpense = zExpense + sExpense;
  const zPercentage = totalExpense ? (zExpense / totalExpense) * 100 : 0;
  const sPercentage = totalExpense ? (sExpense / totalExpense) * 100 : 0;

  return (
    <div className=''>
      <div className='p-4 m-8 border border-b-gray-400 shadow bg-[#ffffff]'>
          <div className="text-xs text-center text-gray-600 mb-4">
              Your total expense is
          </div>
          <h4 className="font-semibold text-center text-6xl text-blue-500 mb-2">
              {formatINR(totalExpense)}
          </h4>
     
        <h3 className='text-center text-gray-600 font-bold mb-4'>
          {
            zExpense && sExpense 
              ? 'using Swiggy and Zomato, 2024' 
              : (
                zExpense
                  ? 'using Zomato, Lifetime'
                  : 'using Swiggy, 2024'
              )
          }
        </h3>

        {
          zExpense && sExpense ? 
              <>
               {/* Split bar */}
                <div className="flex items-center justify-center mb-4">
                  <div className="inline-flex flex-col items-center p-1" style={{ width: `${zPercentage}%`, backgroundColor: 'red' }}>
                    <span className="text-xs text-white">{zPercentage.toFixed(2)}%</span>
                  </div>
                  <div className="inline-flex flex-col items-center p-1 text-right" style={{ width: `${sPercentage}%`, backgroundColor: 'orange' }}>
                    <span className="text-xs text-white">{sPercentage.toFixed(2)}%</span>
                  </div>
                </div>

                {/* Split text */}
                <div className="flex items-center justify-between mb-4 text-gray-600">
                  <div>Zomato: {formatINR(zExpense)}</div>
                  <div>Swiggy: {formatINR(sExpense)}</div>
                </div>
              </>
           : ''
        }
       

        
      </div>
    </div>
  );
}

export default HomeExpense;
