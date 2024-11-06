"use client";

import React from 'react'
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/page';

const page = () => {
  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <Header title="Canteens" /> {/* Pass route-specific title */}
        <div className="p-4">
          {/* Dashboard content */}
        </div>
      </div>
    </div>
  );
}

export default page
