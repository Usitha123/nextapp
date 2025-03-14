// CanteenDashboard/page.js
"use client";

import React from 'react';
import Sidebar from '@/app/admindashboard/Sidebar/page';
import Topbar from '@/app/admindashboard/Topbar/page';
import Header from '@/app/admindashboard/Header/page';
import Dashboardcards from './Dashboardcards';

const CanteenDashboard = () => {
  return (
    <div className="flex bg-black">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <Header title="Dashboard" /> {/* Pass route-specific title */}
        <div className="p-4">
          <Dashboardcards/>
        </div>
      </div>
    </div>
  );
};

export default CanteenDashboard;
