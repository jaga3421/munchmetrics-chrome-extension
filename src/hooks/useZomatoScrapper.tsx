import { useState } from 'react';

import { Order } from '../types';

const useZomatoScrapper = () => {
    const [yearSummary, setYearSummary] = useState<Order[]>([]);
    const [totalOrders, setTotalOrders] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error| string | null>(null);
    let summary: Order[] = [];

    const getYearSummary: any = async (
        page: number = 1,
        resultArray: Order[] = []
    ) => {
        setLoading(true);

        const url = `https://www.zomato.com/webroutes/user/orders?page=${page}`;

        try {
            console.log(`Page ${page} in progress.`);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const orders = data.entities.ORDER;

            Object.keys(orders).forEach((orderId) => {
                const Order: Order = {
                    ...orders[orderId],
                    dishes: processDishString(orders[orderId].dishString),
                    orderDate: processOrderDate(orders[orderId].orderDate),
                };
                summary.push(Order);
                setYearSummary((prev) => [...prev, Order]);
            });

            // Continue the recursion only if there are more pages
            const userOrderHistory = data.sections.SECTION_USER_ORDER_HISTORY;
            setTotalOrders(userOrderHistory.count);
            if (userOrderHistory.currentPage <= userOrderHistory.totalPages) {
                return await getYearSummary(
                    userOrderHistory.currentPage + 1,
                    resultArray
                );
            } else {
                console.log(summary);
                setYearSummary(summary);
                setLoading(false);
                return;
            }
        } catch (error:any) {
            console.error('Error in getYearSummary:', error);
            setLoading(false);
            setError(error);
            throw error;
        }
    };

    function processDishString(dishString: string): string[] {
        // Split the dishString by comma and trim spaces
        const dishesArray = dishString.split(',').map((item) => item.trim());

        // Map through the dishesArray and extract the dish name
        const dishNames:string[][] = dishesArray.map((item) => {
            const parts = item.split('x');
            const count = parseInt(parts[0].trim()) || 1; // Use 1 if the count is not provided or not a valid number
            const dishName = parts[1]?.trim();
            return Array(count).fill(dishName);
        });

        // Flatten the array and return the result
        return ([] as string[]).concat(...dishNames);
    }

    function processOrderDate(orderDate: string): {
        year: number;
        month: number;
        day: number;
        timeSlot: number;
    } {
        /* Transform the string (example: "February 16, 2023 at 02:01 PM") 
                into object of the form { year: 2023, month: 2, day: 16, timeSlot: 14 } 
                timeSlot is the interval of 1 hour starting from 0 to 23
        */
        const date = new Date(orderDate.replace('at', ''));
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // JavaScript months are 0-11
        const day = date.getDate();
        const timeSlot = date.getHours(); // 24-hour format

        return { year, month, day, timeSlot };
    }

    return {
        yearSummary,
        getYearSummary,
        setYearSummary,
        totalOrders,
        loading,
        error,
    };
};

export default useZomatoScrapper;
