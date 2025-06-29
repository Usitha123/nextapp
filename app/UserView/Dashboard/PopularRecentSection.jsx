"use client";

import React, { useState, useEffect } from "react";
import MealDetailCard from "./MealDetailCard";

// Dummy popular items list (you might want to move this to a separate data file)
const popularItems = [
  {
    name: "Chicken Fried Rice",
    canteen: "Open-Canteen",
    image: "https://example.com/chicken-fried-rice.jpg",
  },
  {
    name: "Chicken Kottu",
    canteen: "GYM-Canteen",
    image: "https://example.com/chicken-kottu.jpg",
  },
  {
    name: "Vegetable Pasta",
    canteen: "Rahula-Canteen",
    image: "https://example.com/vegetable-pasta.jpg",
  },
];

// Dummy recent items (you'll need to replace this with real data)
const recentItems = [
  {
    name: "Noodles",
    canteen: "Open-Canteen",
    image: "https://example.com/noodles.jpg",
  },
  {
    name: "Pizza",
    canteen: "GYM-Canteen",
    image: "https://example.com/pizza.jpg",
  },
  {
    name: "Burger",
    canteen: "Rahula-Canteen",
    image: "https://example.com/burger.jpg",
  },
];

export default function PopularRecentSection() {
  const [activeTab, setActiveTab] = useState("popular");
  const [popularItems, setPopularItems] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to determine current meal time
  const getCurrentMealType = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 7 && hour < 11) return "Breakfast";
    if (hour >= 11 && hour < 16) return "Lunch";
    if (hour >= 16 && hour < 21) return "Dinner";
    return "Dinner"; // Default fallback
  };

  // Function to fetch popular items
  const fetchPopularItems = async () => {
    try {
      // Get current meal type
      const currentMealType = getCurrentMealType();
      
      // Calculate date 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      // Fetch orders
      const ordersRes = await fetch('/api/vieworders');
      const mealsRes = await fetch('/api/viewmeal');
      
      if (!ordersRes.ok || !mealsRes.ok) throw new Error('Failed to fetch data');
      
      const { orders } = await ordersRes.json();
      const { meals } = await mealsRes.json();

      // Filter orders by date range and meal type
      const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.meals[0]?.timestamp);
        return orderDate >= sevenDaysAgo &&
               order.orderStatus !== "Cancelled" &&
               order.orderType === currentMealType;
      });

      // Count meal quantities
      const mealCounts = {};
      filteredOrders.forEach(order => {
        order.meals.forEach(meal => {
          if (!mealCounts[meal.mealId]) {
            mealCounts[meal.mealId] = 0;
          }
          mealCounts[meal.mealId] += meal.mealQuantity;
        });
      });

      // Sort meals by quantity and get top 3
      const topMealIds = Object.entries(mealCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([mealId]) => mealId);

      // Get meal details for top meals
      const popularMeals = topMealIds.map(mealId => {
        const mealDetails = meals.find(m => m._id === mealId);
        return mealDetails ? {
          name: mealDetails.mealName,
          canteen: mealDetails.selectCanteen,
          image: mealDetails.image,
          price: mealDetails.mealPrice
        } : null;
      }).filter(Boolean);

      setPopularItems(popularMeals);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching popular items:", err);
      setError("Failed to load popular items.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularItems();

    // Refresh popular items every 5 minutes
    const intervalId = setInterval(fetchPopularItems, 300000);
    return () => clearInterval(intervalId);
  }, []);

  const items = activeTab === "popular" ? popularItems : recentItems;

  return (
    <section>
      <div className="flex mb-4 space-x-4 text-lg font-medium">
        <span
          className={`cursor-pointer ${
            activeTab === "popular"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("popular")}
        >
          Popular
        </span>
        <span
          className={`cursor-pointer ${
            activeTab === "recent"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("recent")}
        >
          Recent
        </span>
      </div>

      {loading ? (
        <p>Loading meals...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((item, index) => (
            <MealDetailCard
              key={index}
              name={item.name}
              canteen={item.canteen}
              image={item.image}
              price={item.price}
            />
          ))}
        </div>
      )}
    </section>
  );
} 