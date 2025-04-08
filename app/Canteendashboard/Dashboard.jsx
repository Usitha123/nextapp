import { CircleDollarSign, Import, OctagonAlert, Package, RefreshCcw, Tag, Upload } from "lucide-react";
import React from "react";

// Reusable card component styled like the canteen/student cards
const DashboardCard = ({ title, value, icon }) => {
  // Use a different background color for Total Revenue
  const valueBgColor = title === "Total Revenue" ? "text-4xl" : "bg-[#4D423E] text-5xl";

  return (
    <div className="relative flex flex-col h-32 w-60 items-center justify-center p-2 text-orange-500 bg-[#2B2623] rounded-lg">
      <div className={`flex items-center gap-2 ${valueBgColor} px-8 py-4 rounded-lg font-thin relative`}>
        <span>{String(value)}</span>
      </div>
      <span className="absolute top-4 w-[18px] h-[20px] right-5 text-[2px]">{icon}</span>
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
    <div className="flex flex-wrap justify-center gap-6 p-4 rounded-lg xl:gap-16">
      {cards.map((card, index) => (
        <DashboardCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
        />
      ))}
    </div>
  );
};

export default DashboardCards;
