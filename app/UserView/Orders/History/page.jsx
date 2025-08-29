"use client";

import React from 'react';
import Sidebar from '../../Sidebar/page';
import Topbar from '../../Topbar/page';
import Header from '../../Header/Header';
import { usePathname } from 'next/navigation';
import OrdersTable from '../History/OrdersTable';

const Page = () => {
  const currentPath = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePath={currentPath} />
      
      {/* Main Content Area */}
      <div className="pt-16 md:pt-0 md:ml-60">
        {/* Topbar - Hidden on mobile since we have the mobile header */}
        <div className="hidden md:block">
          <Topbar />
        </div>
        
        {/* Header */}
        <Header title="Orders" />
        
        {/* Content */}
        <div className="">
          <div className=" rounded-xl overflow-hidden">
            <div className="p-4 md:p-6">
              <OrdersTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;