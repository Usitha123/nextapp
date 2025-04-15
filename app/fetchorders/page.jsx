"use client";

import React, { useEffect, useState } from "react";

function Page() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/vieworders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const getCurrentMealPath = () => {
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 11) return "Breakfast";
    if (hour >= 11 && hour < 16) return "Lunch";
    if (hour >= 16 && hour < 21) return "Dinner";
    return "Dinner"; // Default fallback
  };

  const mealPath = getCurrentMealPath();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const filteredOrders = orders
    .filter(order => order.orderStatus === "Accepted")
    .filter(order => order.orderType === mealPath)
    .filter(order => {
      const timestamp = order.meals?.[0]?.timestamp;
      if (!timestamp) return false;
      const mealDate = new Date(timestamp);
      return mealDate >= sevenDaysAgo;
    });

  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <li key={index}>
              <pre>{JSON.stringify(order, null, 2)}</pre>
              <p>Date: {new Date(order.meals?.[0]?.timestamp).toISOString().split("T")[0]}</p>
            </li>
          ))
        ) : (
          <li>No orders found</li>
        )}
      </ul>
    </div>
  );
}

export default Page;
