"use client";

import React from 'react';
import Sidebar from './Sidebar/page';
import Topbar from './Topbar/page';
import Header from './Header/Header';
import { usePathname } from 'next/navigation';
import Dashboardpage from './Dashboard/page';

const Dashboard = () => {
  const currentPath = usePathname();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar activePath={currentPath} />
      
      {/* Main Content Area */}
      <div className="pt-16 md:pt-0 md:ml-60">
        {/* Topbar - Hidden on mobile since we have the mobile header */}
        <div className="hidden md:block">
          <Topbar />
        </div>
        
        {/* Header */}
        <Header title="Dashboard" />
        
        {/* Content */}
        <div className="p-4 md:p-8">
          <Dashboardpage />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;