// Meals/page.js
"use client";

import React from 'react';
import Sidebar from '../../Sidebar/page';
import Topbar from '../../Topbar/page';
import Header from '../../Header/Header';
import Addmeals from './Addmeals';

const Meals = () => {
  return (
    <div className="flex bg-black">
      <Sidebar />
      <div className="ml-20 md:ml-60 min-h-screen w-full bg-black">
        <Topbar />
        <Header title="Add Meals" /> {/* Pass another route-specific title */}
        <div className="p-4">
          <Addmeals />

          {/* Meals content */}
        </div>
      </div>
    </div>
  );
};

export default Meals;
