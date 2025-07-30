"use client";

import {
  CircleDollarSign,
  Import,
  OctagonAlert,
  Package,
  Tag,
  Upload,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import SalesStatistics from "./SalesStatistics";

// Reusable card component
const DashboardCard = ({ title, value, icon }) => {
  const valueStyle =
    title === "Total Revenue" ? "text-2xl" : "bg-[#4D423E] text-5xl";

  return (
    <div className="relative flex flex-col h-28 w-44 items-center justify-center p-2 text-orange-500 bg-[#2B2623] rounded-lg">
      <div
        className={`flex items-center gap-4 ${valueStyle} px-4 py-1 rounded-lg font-thin`}
      >
        <span>{String(value)}</span>
      </div>
      <span className="absolute top-1 right-5 text-[1px] w-[6px] h-[6px]">
        {icon}
      </span>
      <div className="mt-2 text-gray-300 text-md">{title}</div>
    </div>
  );
};

const DashboardCards = () => {
  const [newOrders, setNewOrders] = useState(0);
  const [readyOrders, setReadyOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);
  const [totalMeals, setTotalMeals] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/vieworders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();

        setNewOrders(data.filter(o => o.orderStatus === "Pending").length);
        setReadyOrders(data.filter(o => o.orderStatus === "Ready").length);
        setCancelledOrders(data.filter(o => o.orderStatus === "Cancelled").length);
        setTotalOrders(data.length);
        setTotalMeals(data.reduce((sum, o) => sum + (o.meals?.length || 0), 0));
        setRevenue(data.reduce((sum, o) => sum + (o.totalAmount || 0), 0));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const cards = [
    { title: "New Orders", value: newOrders, icon: <Import /> },
    { title: "Orders Ready", value: readyOrders, icon: <Upload /> },
    { title: "Orders Cancelled", value: cancelledOrders, icon: <OctagonAlert /> },
    { title: "Total Meals", value: totalMeals, icon: <Tag /> },
    { title: "Total Orders", value: totalOrders, icon: <Package /> },
    { title: "Total Revenue", value: `${revenue} Rs`, icon: <CircleDollarSign /> },
  ];

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
      <div className="p-4">
        <SalesStatistics />
      </div>
    </div>
  );
};

export default DashboardCards;
