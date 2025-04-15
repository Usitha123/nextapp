
"use client";

import React from 'react';
import Sidebar from './Sidebar/page';
import Topbar from './Topbar/page';
import Header from './Header/page';
import { usePathname } from 'next/navigation';
import Dashboardpage from './Dashboard/page'


const Dashboard = () => {
  const currentPath = usePathname();
  return (
    <div className="flex bg-gray-100">
      
      <Sidebar activePath={currentPath} /> 
      <div className="flex-1">
        <Topbar />
        <Header title="Dashboard" /> {/* Pass route-specific title */}
        <div className="p-4">
         <Dashboardpage />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
