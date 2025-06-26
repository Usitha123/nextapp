"use client";

import React from 'react';
import Sidebar from '@/app/admindashboard/Sidebar/Sidebar';
import Topbar from '@/app/admindashboard/Topbar/page';
import Header from '@/app/admindashboard/Header/Header';
import Dashboardcards from './Dashboardcards';
import RegistrationStatistics from './RegistrationStatistics';

const AdminDashboard = () => {
  return (
    <div className="flex bg-black">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <Header title="Dashboard" /> {/* Pass route-specific title */}
        <div className="p-4 space-y-6">
          <Dashboardcards/>
          <RegistrationStatistics />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
