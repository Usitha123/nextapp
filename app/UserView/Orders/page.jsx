"use client";

import React from 'react';
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/page';
import { usePathname } from 'next/navigation';
import OrdersTable from './OrdersTable';

const ongoingOrders = [
  { id: '#od1234', status: 'Pending', date: '12/07/24', canteen: 'Skycafe' },
  { id: '#od1235', status: 'Accepted', date: '12/07/24', canteen: 'Open' },
];

const historyOrders = [
  { id: '#od2234', status: 'Picked', date: '11/07/24', canteen: 'Rahula' },
  { id: '#od2235', status: 'Cancelled', date: '10/07/24', canteen: 'Skycafe' },
];
const Page = () => {
  const currentPath = usePathname();

  return (
    <div className="flex bg-gray-100">
      <Sidebar activePath={currentPath} /> {/* Pass current path as activePath */}
      <div className="flex-1">
        <Topbar />
        <Header title="Orders" />
        <div className="p-4">
        <OrdersTable ongoingOrders={ongoingOrders} historyOrders={historyOrders} />
        {/* Dashboard content */}
        </div>
      </div>
    </div>
  );
};

export default Page;
