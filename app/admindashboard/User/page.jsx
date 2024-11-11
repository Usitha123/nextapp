// Meals/page.js
"use client";

import React from 'react';
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/page';
import Hello from './hello';

const Meals = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <Header title="User" /> {/* Pass another route-specific title */}
        <div className="p-4">
        <Hello />
          {/* Meals content */}
        </div>
      </div>
    </div>
  );
};

export default Meals;
