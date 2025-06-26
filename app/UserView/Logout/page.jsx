"use client";

import React from 'react';
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/Header';
import { usePathname } from 'next/navigation';

const Page = () => {
  const currentPath = usePathname();

  return (
    <div className="flex bg-gray-100">
      <Sidebar activePath={currentPath} /> {/* Pass current path as activePath */}
      <div className="flex-1">
        <Topbar />
        <Header title="Logout" />
        <div className="p-4">
          {/* Dashboard content */}
        </div>
      </div>
    </div>
  );
};

export default Page;

