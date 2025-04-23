// Meals/page.js
"use client";

import React from 'react';
import Sidebar from '../../Sidebar/Sidebar';
import Topbar from '../../Topbar/page';
import Header from '../../Header/page';
import Userdetails from './Userdetails';
import Test from './test';

const Meals = () => {
  return (
    <div className="flex bg-black">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <Header title="Students" /> {/* Pass another route-specific title */}
        <div className="p-4">
        <Userdetails />
          {/* Meals content */}
        </div>
      </div>
    </div>
  );
};

export default Meals;
