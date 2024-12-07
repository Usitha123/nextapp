"use client";

import React, { useState } from 'react';
import Sidebar from '../../Sidebar/page';
import Topbar from '../../Topbar/page';
import Header from '../../Header/page';
import Cashierdetails from './Cashierdetails';

function page() {
  return (
    <div className="flex bg-black">
      <Sidebar/>
      <div className="flex-1">
        <Topbar />
        <Header title="Cashier" />
        <div className="p-4">
            <Cashierdetails/>
        </div>
      </div>
    </div>
  )
}

export default page