import React from 'react';

const stats = [
  { label: 'Active Students', value: 50, icon: '👥' },
  { label: 'Active Canteens', value: 5, icon: '🍽️' },
  { label: 'Blocked Canteens', value: 2, icon: '🚫' },
];

const Body = () => {
  return (
    <div className="flex p-4 space-x-4">
      {stats.map((stat, index) => (
        <div key={index} className="flex flex-col items-center justify-center w-40 h-32 p-6 text-white bg-gray-700 rounded-md">
          <div className="text-3xl font-bold text-orange-500">{stat.value}</div>
          <div className="flex items-center text-sm">
            <span className="mr-2">{stat.icon}</span>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Body;
