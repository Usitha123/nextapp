// CanteenDashboard/page.js
"use client";

import React from 'react';
import Sidebar from './Sidebar/page';
import Topbar from './Topbar/page';
import Header from './Header/Header';
import Dashboard from './Dashboard';

const CanteenDashboard = () => {
  return (
    <div className="flex bg-black">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <Header title="Cashier Dashboard" /> {/* Pass route-specific title */}
        <div className="p-4">
          <Dashboard/>
        </div>
      </div>
    </div>
  );
};

export default CanteenDashboard;
