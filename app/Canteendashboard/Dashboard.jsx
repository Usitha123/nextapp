import { CircleDollarSign, Import, OctagonAlert, Package, RefreshCcw, Tag, Upload } from "lucide-react";
import SalesStatistics from "./SalesStatistics";
import React from "react";

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
  const cards = [
    { title: "New Orders", value: 3, icon: <Import/> },
    { title: "Orders Ready", value: 5, icon: <Upload/>},
    { title: "Orders Cancelled", value: 2, icon: <OctagonAlert/> },
    { title: "Total Meals", value: 6, icon: <Tag/> },
    { title: "Total Orders", value: 10, icon: <Package/> },
    { title: "Total Revenue", value: "12000 Rs", icon: <CircleDollarSign/> },
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
    <div className="p-4 ">
      <SalesStatistics />
    </div>
    
    </div>
    
  );
};

export default DashboardCards;
