"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BoxIcon, LayoutDashboardIcon, LayoutGrid, LogOut, UserRound, Utensils } from 'lucide-react';

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="w-20 md:w-60 h-screen p-4 text-black bg-white">
      <h1 className="mb-10 hidden md:block text-center text-2xl font-bold text-[#ff842f]">LOGO</h1>
      <ul className="space-y-4">
        {/* Correct usage of Link without <a> */}
        <li>
          <Link href="/UserView" className="gap-3 flex p-2 rounded hover:bg-orange-50 hover:text-orange-500 ">
            <span><LayoutDashboardIcon/></span>  <span className='hidden md:flex'>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link href="/UserView/Canteens" className="gap-3 flex p-2 rounded hover:bg-orange-50 hover:text-orange-500">
            <span><Utensils/></span><span className='hidden md:flex'>Canteens </span>
          </Link>
        </li>
        <li>
          <Link href="/UserView/Orders" className="gap-3 flex p-2 rounded hover:bg-orange-50 hover:text-orange-500">
            <BoxIcon/> <span className='hidden md:flex'>Orders</span>
          </Link>
        </li>
        <li>
          <Link href="/UserView/Profile" className="gap-3 flex p-2 rounded hover:bg-orange-50 hover:text-orange-500">
          <span><UserRound/></span>  <span className='hidden md:flex'>Profile</span> 
          </Link>
        </li>
        <li>
          <Link href="/UserView/Logout" className="gap-3 flex p-2 rounded hover:bg-orange-50 hover:text-orange-500">
            <span><LogOut/></span>   <span className='hidden md:flex'>Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
