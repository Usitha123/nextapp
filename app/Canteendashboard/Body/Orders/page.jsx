import React from 'react';

const Orders = () => {
  const stats = [
    { id: 1, label: 'New Orders', value: 3, icon: '🆕' },
    { id: 2, label: 'Orders Ready', value: 5, icon: '✅' },
    { id: 3, label: 'Orders Cancelled', value: 2, icon: '❌' },
    { id: 4, label: 'Total Meals', value: 6, icon: '🍽️' },
    { id: 5, label: 'Total Orders', value: 10, icon: '📦' },
    { id: 6, label: 'Total Revenue', value: '12000 Rs', icon: '💰' },
  ];
  return (
    <div >
    <div className="grid grid-cols-3 gap-4">
      {stats.map(stat => (
        <div
          key={stat.id}
          className="flex flex-col items-center justify-center p-4 text-center text-white bg-gray-800 rounded-lg"
        >
          <span className="mb-2 text-4xl font-bold">{stat.value}</span>
          <span className="text-sm">{stat.label}</span>
        </div>
      ))}
    </div>
  </div>
  );
};

export default Orders;