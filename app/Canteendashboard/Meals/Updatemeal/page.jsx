// Meals/page.js
"use client";

import React from 'react';
import Sidebar from '../../Sidebar/page';
import Topbar from '../../Topbar/page';
import Header from '../../Header/page';
import Updatemeal from './Updatemeal';


const Meals = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-black">
        <Topbar />
        <Header title="Update Meals" /> {/* Pass another route-specific title */}
        <div className="p-4">
          <Updatemeal/>
          {/* Meals content */}
        </div>
      </div>
    </div>
  );
};

export default Meals;
