"use client";

import React from 'react';
import Sidebar from './Sidebar/page';
import Topbar from './Topbar/page';
import Header from './Header/page';
import Dashboard from './Body/Dashboard/page'

const CanteenDashboard = () => {
  return (
    <div className="flex">
      <Sidebar/>
      <div className="flex-1">
        <Topbar />
        <Header />
        <div className="p-4">
          <Dashboard />
        </div>
      </div>
    </div>

  );
};

export default CanteenDashboard;


