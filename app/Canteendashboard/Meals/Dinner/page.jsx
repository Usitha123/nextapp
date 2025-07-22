// Meals/page.js
"use client";

import React from 'react';
import Sidebar from '../../Sidebar/page';
import Topbar from '../../Topbar/page';
import Header from '../../Header/Header';
import Mealslist from './Mealslist';


const Meals = () => {
  return (
    <div className="flex bg-black">
      <Sidebar />
      <div className="ml-20 md:ml-60 h-[100vh] w-[100vw]"> 
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
