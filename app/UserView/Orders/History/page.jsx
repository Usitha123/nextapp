"use client";

import React from 'react';
import Sidebar from '../../Sidebar/page';
import Topbar from '../../Topbar/page';
import Header from '../../Header/page';
import { usePathname } from 'next/navigation';
import OrdersTable from '../Ongoing/OrdersTable';


const Page = () => {
  const currentPath = usePathname();

  return (
    <div className="flex bg-gray-100">
      <Sidebar activePath={currentPath} /> {/* Pass current path as activePath */}
      <div className="flex-1">
        <Topbar />
        <Header title="Orders" />
        <div className="p-4">
        <OrdersTable />
        {/* Dashboard content */}
        </div>
      </div>
    </div>
  );
};

export default Page;
