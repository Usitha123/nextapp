"use client";

import React, { useState } from 'react';
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/Header';
import Cashierdetails from './Cashierdetails';

function page() {
  return (
    <div className="flex bg-black">
      <Sidebar/>
<div className="w-full min-h-screen ml-20 bg-black md:ml-60">
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