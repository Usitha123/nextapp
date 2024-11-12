import React from "react";

const DashboardCards = () => {
  const cards = [
    { title: "New Orders", value: 3, icon: "🔄" },
    { title: "Orders Ready", value: 5, icon: "📦" },
    { title: "Orders Cancelled", value: 2, icon: "⚙️" },
    { title: "Total Meals", value: 6, icon: "🏷️" },
    { title: "Total Orders", value: 10, icon: "📈" },
    { title: "Total Revenue", value: "12000 Rs", icon: "💰" },
  ];

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-white">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="p-4 text-center text-orange-400 bg-gray-700 rounded-lg"
          >
            <div className="mb-2 text-4xl">{String(card.value).padStart(2, "0")}</div>
            <div className="text-sm tracking-wide text-gray-400 uppercase">
              {card.title}
            </div>
            <div className="text-2xl">{card.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCards;
