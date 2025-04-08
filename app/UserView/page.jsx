
"use client";

import React from 'react';
import Sidebar from './Sidebar/page';
import Topbar from './Topbar/page';
import Header from './Header/page';
import { usePathname } from 'next/navigation';


const Dashboard = () => {
  const currentPath = usePathname();
  return (
    <div className="flex bg-gray-100">
      
      <Sidebar activePath={currentPath} /> 
      <div className="flex-1">
        <Topbar />
        <Header title="Dashboard" /> {/* Pass route-specific title */}
        <div className="p-4">
          {/* Dashboard content */}
          <h1>hello</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
