// Meals/page.js
"use client";

import React from 'react';
import Sidebar from '../../Sidebar/page';
import Topbar from '../../Topbar/page';
import Header from '../../Header/Header';
import Mealslist from './Mealslist';

const Meals = () => {
  return (
    <div className="flex bg-black min-h-screen">
      <Sidebar />
      <div className="ml-20 md:ml-60 flex-1 flex flex-col bg-black"> 
        <Topbar />
        <Header title="Meals" />
        <div className="flex-1 p-4 bg-black overflow-auto">
          <Mealslist />
        </div>
      </div>
    </div>
  );
};

export default Meals;