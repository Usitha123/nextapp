import React from 'react';
import Link from 'next/link';


const Sidebar = () => {
  return (
    
    <div className="w-64 h-screen p-4 text-white bg-gray-800">
    <h1 className="mb-6 text-2xl font-bold text-orange-500">LOGO</h1>
    <ul className="space-y-4">
      {['Dashboard', 'Canteens', 'User', 'Reports', 'Profile', 'Logout'].map((item) => (
        <li key={item} className="p-2 rounded-md cursor-pointer hover:bg-gray-700">
          {item}
        </li>
      ))}
    </ul>
  </div>
    
  );
};

export default Sidebar;
