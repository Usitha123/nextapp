import { CircleDollarSign, Import, OctagonAlert, Package, RefreshCcw, Tag, Upload } from "lucide-react";
import SalesStatistics from "./SalesStatistics";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

// Reusable card component styled like the canteen/student cards
const DashboardCard = ({ title, value, icon }) => {
  // Use a different background color for Total Revenue
  const valueBgColor = title === "Total Revenue" ? "text-2xl" : "bg-[#4D423E] text-5xl";

  return (
    <div className="relative flex flex-col h-28 w-44 items-center justify-center p-2 text-orange-500 bg-[#2B2623] rounded-lg">
      <div className={`flex items-center gap-4 ${valueBgColor} px-4 py-1 rounded-lg font-thin relative`}>
        <span>{String(value)}</span>
      </div>
      <span className="absolute top-1 w-[6px] h-[6px] right-5 text-[1px]">{icon}</span>
      <div className="mt-2 text-gray-300 text-md">{title}</div>
    </div>
  );
};

const DashboardCards = () => {
  const [cards, setCards] = useState([
    { title: "New Orders", value: 0, icon: <Import/> },
    { title: "Orders Ready", value: 0, icon: <Upload/>},
    { title: "Orders Cancelled", value: 0, icon: <OctagonAlert/> },
    { title: "Total Meals", value: 0, icon: <Tag/> },
    { title: "Total Orders", value: 0, icon: <Package/> },
    { title: "Total Revenue", value: "0 Rs", icon: <CircleDollarSign/> },
  ]);
  const { data: session } = useSession();

  // Get current meal type based on time
  const getCurrentMealType = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 7 && hour < 11) return "Breakfast";
    if (hour >= 11 && hour < 16) return "Lunch";
    if (hour >= 16 && hour < 21) return "Dinner";
    return "Dinner"; // Default fallback
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders and meals
        const [ordersResponse, mealsResponse] = await Promise.all([
          fetch('/api/vieworders'),
          fetch('/api/viewmeal')
        ]);

        if (!ordersResponse.ok || !mealsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const { orders } = await ordersResponse.json();
        const { meals } = await mealsResponse.json();

        // Get current date and meal type
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentMealType = getCurrentMealType();

        // Filter orders for current day
        const todayOrders = orders.filter(order => {
          const orderDate = new Date(order.meals[0]?.timestamp);
          return orderDate.toDateString() === today.toDateString();
        });

        // Calculate card values
        const newOrders = todayOrders.filter(order => 
          order.orderStatus === "Pending" && order.orderType === currentMealType
        ).length;

        const ordersReady = todayOrders.filter(order => 
          order.orderStatus === "Ready" && order.orderType === currentMealType
        ).length;

        const ordersCancelled = todayOrders.filter(order => 
          order.orderStatus === "Cancelled"
        ).length;

        const totalOrders = todayOrders.filter(order => 
          order.orderStatus !== "Cancelled"
        ).length;

        // Calculate total revenue (same logic as SalesStatistics.jsx)
        const validOrders = todayOrders.filter(order => 
          order.orderStatus !== "Cancelled"
        );

        const totalRevenue = validOrders.reduce((sum, order) => {
          return sum + order.meals.reduce((mealSum, meal) => 
            mealSum + (meal.mealPrice * meal.mealQuantity), 0
          );
        }, 0);

        // Get unique meals for the currently logged-in canteen
        let uniqueMeals = 0;
        if (session?.user?.canteenName) {
          const canteenMeals = meals.filter(meal => meal.selectCanteen === session.user.canteenName);
          uniqueMeals = new Set(canteenMeals.map(meal => meal.mealName)).size;
        }

        // Update cards with real values
        setCards([
          { title: "New Orders", value: newOrders, icon: <Import/> },
          { title: "Orders Ready", value: ordersReady, icon: <Upload/>},
          { title: "Orders Cancelled", value: ordersCancelled, icon: <OctagonAlert/> },
          { title: "Total Meals", value: uniqueMeals, icon: <Tag/> },
          { title: "Total Orders", value: totalOrders, icon: <Package/> },
          { title: "Total Revenue", value: `${totalRevenue} Rs`, icon: <CircleDollarSign/> },
        ]);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    if (session?.user?.canteenName) {
      fetchData();
    }
  }, [session]);

  return (
    <div>
      <div className="flex flex-wrap justify-between gap-4 p-4 rounded-lg">
      {cards.map((card, index) => (
        <DashboardCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
        />
      ))}
      
    </div>
    <div className="p-4 ">
      <SalesStatistics />
    </div>
    
    </div>
    
  );
};

export default DashboardCards;
