// Meals/page.js
"use client";

import React from 'react';
import Sidebar from '../../../Sidebar/Sidebar';
import Topbar from '../../../Topbar/page';
import Header from '../../../Header/Header';
import Addowner from './Addowner';

const Meals = () => {
  return (
    <div className="flex bg-black">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <Header title="Add Owner" /> {/* Pass another route-specific title */}
        <div className="p-4">
        <Addowner/>
          
        </div>
      </div>
    </div>
  );
};

export default Meals;
