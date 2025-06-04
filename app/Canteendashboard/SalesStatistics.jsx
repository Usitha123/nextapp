import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const SalesStatistics = () => {
  const [timeframe, setTimeframe] = useState('daily');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/vieworders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const { orders } = await res.json();
      processOrderData(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const processOrderData = (orders) => {
    // Filter out cancelled orders
    const validOrders = orders.filter(order => order.orderStatus !== "Cancelled");
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Process daily data (last 7 days)
    const dailyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayOrders = validOrders.filter(order => {
        const orderDate = new Date(order.meals[0]?.timestamp);
        return orderDate.toDateString() === date.toDateString();
      });

      const totalSales = dayOrders.reduce((sum, order) => 
        sum + order.meals.reduce((mealSum, meal) => 
          mealSum + (meal.mealPrice * meal.mealQuantity), 0), 0);

      return {
        name: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()],
        Sales: totalSales,
        Orders: dayOrders.length
      };
    }).reverse();

    // Process weekly data (last 4 weeks)
    const weeklyData = Array.from({ length: 4 }, (_, i) => {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekOrders = validOrders.filter(order => {
        const orderDate = new Date(order.meals[0]?.timestamp);
        return orderDate >= weekStart && orderDate <= weekEnd;
      });

      const totalSales = weekOrders.reduce((sum, order) => 
        sum + order.meals.reduce((mealSum, meal) => 
          mealSum + (meal.mealPrice * meal.mealQuantity), 0), 0);

      return {
        name: `Week ${4 - i}`,
        Sales: totalSales,
        Orders: weekOrders.length
      };
    }).reverse();

    // Process monthly data (last 3 months)
    const monthlyData = Array.from({ length: 3 }, (_, i) => {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);

      const monthOrders = validOrders.filter(order => {
        const orderDate = new Date(order.meals[0]?.timestamp);
        return orderDate >= monthStart && orderDate <= monthEnd;
      });

      const totalSales = monthOrders.reduce((sum, order) => 
        sum + order.meals.reduce((mealSum, meal) => 
          mealSum + (meal.mealPrice * meal.mealQuantity), 0), 0);

      return {
        name: monthStart.toLocaleString('default', { month: 'short' }),
        Sales: totalSales,
        Orders: monthOrders.length
      };
    }).reverse();

    setData({
      daily: dailyData,
      weekly: weeklyData,
      monthly: monthlyData
    });
  };

  const getData = () => {
    if (!data[timeframe]) return [];
    return data[timeframe];
  };

  if (loading) {
    return (
      <div className="p-6 bg-[#2B2623] rounded-lg">
        <div className="text-gray-300">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#2B2623] rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-orange-500">Sales Statistics</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-4 py-2 rounded-lg ${
              timeframe === 'daily'
                ? 'bg-orange-500 text-white'
                : 'bg-[#4D423E] text-gray-300'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-2 rounded-lg ${
              timeframe === 'weekly'
                ? 'bg-orange-500 text-white'
                : 'bg-[#4D423E] text-gray-300'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-2 rounded-lg ${
              timeframe === 'monthly'
                ? 'bg-orange-500 text-white'
                : 'bg-[#4D423E] text-gray-300'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>
      
      <div className="w-full h-[180px] md:h-[300px]">
        <ResponsiveContainer>
          <BarChart
            data={getData()}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4D423E" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis yAxisId="left" stroke="#9CA3AF" />
            <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#2B2623',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value, name) => [
                name === 'Sales' ? `Rs ${value}` : value,
                name
              ]}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="Sales" name="Sales (Rs)" fill="#F97316" />
            <Bar yAxisId="right" dataKey="Orders" name="Number of Orders" fill="#787878" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesStatistics; 