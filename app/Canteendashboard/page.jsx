// CanteenDashboard/page.js
"use client";

import React from 'react';
import Sidebar from './Sidebar/page';
import Topbar from './Topbar/page';
import Header from './Header/Header';
import Dashboard from './Dashboard';

const CanteenDashboard = () => {
  return (
    <div className="flex bg-black min-h-screen">
      <Sidebar />
      <div className="ml-20 md:ml-60 flex-1 flex flex-col bg-black"> 
        <Topbar />
        <Header title="Dashboard" /> {/* Pass route-specific title */}
        <div className="p-4">
          <Dashboard/>
        </div>
      </div>
    </div>
  );
};

export default CanteenDashboard;
