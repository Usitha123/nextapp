// Meals/page.js
"use client";

import React from 'react';
import Sidebar from '../../../Sidebar/Sidebar';
import Topbar from '../../../Topbar/page';
import Header from '../../../Header/Header';
import Addadmin from './Addadmin';

const Meals = () => {
  return (
    <div className="flex bg-black">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <Header title="Add Admin" /> {/* Pass another route-specific title */}
        <div className="p-4">
        <Addadmin/>
          
        </div>
      </div>
    </div>
  );
};

export default Meals;
