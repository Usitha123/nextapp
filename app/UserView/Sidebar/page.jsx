"use client";

import React from 'react';
import {LayoutDashboard, LogOut, Package, UserRound, Utensils, 
} from 'lucide-react';

const navItems = [
  { icon: <LayoutDashboard/> , text: "Dashboard" },
  { icon: <Utensils/>, text:"Canteens" },
  { icon: <Package/>, text:"Orders" },
  { icon: <UserRound/>, text:"Profile" },
  { icon: <LogOut/>, text:"Logout" }
]

const Sidebar = ({ onSectionChange }) => {
  return (    
    <div className="w-20 md:w-60 h-screen p-4 text-black bg-white">
      <h1 className="mb-10 hidden md:block text-center text-2xl font-bold text-orange-500">LOGO</h1>
      <ul className="space-y-4">
        {navItems.map((item) => (
          
          <li
            key={item.text}
            className="p-2 rounded-md cursor-pointer hover:bg-orange-100 active:text-orange-500 flex items-center space-x-2"
            onClick={() => onSectionChange(item.text)}
          >
            {item.icon}
            <span className='hidden md:inline-flex'>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
