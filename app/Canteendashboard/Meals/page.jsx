// Meals/page.js
"use client";

import React from 'react';
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/page';
import Mealslist from './Mealslist';


const Meals = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <Header title="Meals" /> {/* Pass another route-specific title */}
        <div className="p-4">
          <Mealslist/>
          {/* Meals content */}
        </div>
      </div>
    </div>
  );
};

export default Meals;
