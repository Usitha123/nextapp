import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const Reportdetails = ({ dateRange }) => {
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState("");
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    peakSalesTime: "",
    totalOrders: 0,
    averageOrderValue: 0,
    cancelledOrders: 0,
    topSellingItems: []
  });

  useEffect(() => {
    // Set the initial time in 24-hour format
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }));
  }, []);

  useEffect(() => {
    fetchSalesData();
  }, [dateRange]);

  const fetchSalesData = async () => {
    try {
      // Fetch both orders and meals data
      const [ordersRes, mealsRes] = await Promise.all([
        fetch('/api/vieworders'),
        fetch('/api/viewmeal')
      ]);

      if (!ordersRes.ok || !mealsRes.ok) throw new Error('Failed to fetch data');
      
      const { orders } = await ordersRes.json();
      const { meals } = await mealsRes.json();

      // Create a map of meal IDs to their types
      const mealTypeMap = new Map(
        meals.map(meal => [meal._id, meal.mealType])
      );

      // Filter orders by date range and current canteen
      const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.meals[0]?.timestamp);
        const startDate = new Date(dateRange.startDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(dateRange.endDate);
        endDate.setHours(23, 59, 59, 999);
        
        return orderDate >= startDate && 
               orderDate <= endDate && 
               order.canteenName === session?.user?.canteenName;
      });

      // Calculate metrics
      const validOrders = filteredOrders.filter(order => order.orderStatus !== "Cancelled");
      const totalSales = validOrders.reduce((sum, order) => 
        sum + order.meals.reduce((mealSum, meal) => 
          mealSum + (parseFloat(meal.mealPrice) * meal.mealQuantity), 0), 0);

      // Calculate peak sales time
      const mealTypeCounts = {
        Breakfast: 0,
        Lunch: 0,
        Dinner: 0
      };

      validOrders.forEach(order => {
        if (order.orderType) {
          mealTypeCounts[order.orderType]++;
        }
      });

      const peakSalesTime = Object.entries(mealTypeCounts)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];

      setSalesData({
        totalSales,
        peakSalesTime,
        totalOrders: validOrders.length,
        averageOrderValue: validOrders.length ? (totalSales / validOrders.length) : 0,
        cancelledOrders: filteredOrders.filter(order => order.orderStatus === "Cancelled").length,
        topSellingItems: calculateTopSellingItems(validOrders, mealTypeMap)
      });

    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  const calculateTopSellingItems = (orders, mealTypeMap) => {
    const itemSales = {};
    
    orders.forEach(order => {
      order.meals.forEach(meal => {
        if (!itemSales[meal.mealId]) {
          itemSales[meal.mealId] = {
            itemName: meal.mealName,
            quantitySold: 0,
            revenue: 0,
            category: mealTypeMap.get(meal.mealId) || 'Unknown' // Get category from meals collection
          };
        }
        itemSales[meal.mealId].quantitySold += meal.mealQuantity;
        itemSales[meal.mealId].revenue += meal.mealQuantity * parseFloat(meal.mealPrice);
      });
    });

    return Object.values(itemSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  };

  return (
    <div className="p-6">
      <h1 className="mb-8 text-2xl font-bold text-center">Sales and Performance Report</h1>
      
      {/* Section 1: Report Details */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>Date/Duration: {dateRange.startDate} to {dateRange.endDate}</div>
          <div>Time: {currentTime}</div>
          <div>Canteen Name: {session?.user?.canteenName}</div>
        </div>
      </div>

      {/* Section 2: Sales Summary */}
      <div className="mb-6">
        <h2 className="px-2 py-1 mb-3 text-lg font-semibold bg-orange-100">SALES SUMMARY</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>Total Sales: Rs. {salesData.totalSales.toFixed(2)}</div>
          <div>Peak Sales Time: {salesData.peakSalesTime}</div>
          <div>Total Orders: {salesData.totalOrders}</div>
          <div>Average Order Value: Rs. {salesData.averageOrderValue.toFixed(2)}</div>
          <div>Cancelled Orders: {salesData.cancelledOrders}</div>
        </div>
      </div>

      {/* Section 3: Top Selling Items */}
      <div className="mb-6">
        <h2 className="px-2 py-1 mb-3 text-lg font-semibold bg-orange-100">TOP SELLING ITEMS</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Rank</th>
              <th className="p-2 text-left">Item Name</th>
              <th className="p-2 text-left">Quantity Sold</th>
              <th className="p-2 text-left">Revenue</th>
              <th className="p-2 text-left">Category</th>
            </tr>
          </thead>
          <tbody>
            {salesData.topSellingItems.map((item) => (
              <tr key={item.rank} className="border-b">
                <td className="p-2">{item.rank}</td>
                <td className="p-2">{item.itemName}</td>
                <td className="p-2">{item.quantitySold}</td>
                <td className="p-2">Rs. {item.revenue.toFixed(2)}</td>
                <td className="p-2">{item.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 4: Notes */}
      <div>
        <h2 className="px-2 py-1 mb-3 text-lg font-semibold bg-orange-100">Notes</h2>
        <div className="h-32 p-2 border border-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default Reportdetails;
