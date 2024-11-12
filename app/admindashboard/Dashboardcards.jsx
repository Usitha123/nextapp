import React from 'react';
import { FaUser, FaStore, FaBan } from 'react-icons/fa';

const DashboardCards = () => {
  const stats = [
    { id: 1, count: 50, label: 'Active Students', icon: <FaUser size={20} /> },
    { id: 2, count: 5, label: 'Active Canteens', icon: <FaStore size={20} /> },
    { id: 3, count: 2, label: 'Blocked Canteens', icon: <FaBan size={20} /> },
  ];

  return (
    <div className="flex gap-4 p-4 mt-4 bg-gray-800 rounded-lg">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="flex flex-col items-center justify-center p-4 text-orange-500 bg-gray-900 rounded-lg w-36"
        >
          <div className="flex items-center gap-2 text-3xl font-bold">
            <span>{stat.count}</span>
            <span className="text-orange-500">{stat.icon}</span>
          </div>
          <div className="mt-2 text-sm text-gray-300">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
