// CanteenDashboard/page.js
"use client";

import React from 'react';
import Sidebar from './Sidebar/page';
import Topbar from './Topbar/page';
import Header from './Header/page';
import Dashboard from './Dashboard';

const CanteenDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <Header title="Canteen Dashboard" /> {/* Pass route-specific title */}
        <div className="p-4">
          <Dashboard/>
        </div>
      </div>
    </div>
  );
};

export default CanteenDashboard;
