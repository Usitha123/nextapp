"use client";

import React from 'react';
import Sidebar from '../Sidebar/page';
import Topbar from '../Topbar/page';
import Header from '../Header/Header';
import { usePathname } from 'next/navigation';
import Profile from './Profile';

const Page = () => {
  const currentPath = usePathname();

  return (
    <div className="flex bg-gray-100">
      <Sidebar activePath={currentPath} /> {/* Pass current path as activePath */}
      
      {/* Main Content Area */}
      <div className="pt-16 md:pt-0 ml-0 md:ml-60 h-[100vh] w-[100vw]">
        {/* Topbar - Hidden on mobile */}
        <div className="hidden md:block">
          <Topbar />
        </div>
        
        <Header title="Profile" />
        
        <div className="p-4">
          <Profile/>
          {/* Dashboard content */}
        </div>
      </div>
    </div>
  );
};

export default Page;