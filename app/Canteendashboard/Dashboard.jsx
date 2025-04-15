import React from "react";
import SalesStatistics from "./SalesStatistics";
import { SquareArrowDown, Package, XCircle, Utensils, BarChart3, Wallet } from 'lucide-react';

// Reusable DashboardCard component
const DashboardCard = ({ count, label, Icon }) => (
  <div className="relative flex flex-col h-32 w-60 items-center justify-center p-2 text-orange-500 bg-[#2B2623] rounded-lg">
    <div className="flex items-center gap-2 text-5xl bg-[#4D423E] px-8 py-4 rounded-lg font-thin">
      <span>{count}</span>
      <Icon className="absolute top-4 w-[18px] h-[20px] right-4 text-[2px]" />
    </div>
    <div className="mt-2 text-gray-300 text-md">{label}</div>
  </div>
);

const DashboardCards = () => {
  const cards = [
    { title: "New Orders", value: 3, Icon: SquareArrowDown },
    { title: "Orders Ready", value: 5, Icon: Package },
    { title: "Orders Cancelled", value: 2, Icon: XCircle },
    { title: "Total Meals", value: 6, Icon: Utensils },
    { title: "Total Orders", value: 10, Icon: BarChart3 },
    { title: "Total Revenue", value: 12000, Icon: Wallet },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-center gap-6 p-2 mt-2 rounded-lg xl:gap-16">
        {cards.map((card, index) => (
          <DashboardCard
            key={index}
            count={String(card.value).padStart(2, "0")}
            label={card.title}
            Icon={card.Icon}
          />
        ))}
      </div>
      
      <SalesStatistics />
    </div>
  );
};

export default DashboardCards;
