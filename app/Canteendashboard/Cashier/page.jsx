"use client";

import React, { useState } from 'react';
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/Header';
import Cashierdetails from './Cashierdetails';

function page() {
  return (
    <div className="flex bg-black min-h-screen">
      <Sidebar />
      <div className="ml-20 md:ml-60 flex-1 flex flex-col bg-black"> 
        <Topbar />
        <Header title="Cashiers" />
        <div className="p-4">
            <Cashierdetails/>
        </div>
      </div>
    </div>
  )
  
}

export default page