"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation";
import { signOut } from 'next-auth/react';
import { Boxes, LayoutDashboard, LogOut, Package, UserRoundPen } from 'lucide-react';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const isActive = (path) => pathname === path;

  return (
    <div className="w-20 h-[100vh] p-4 text-gray-300 bg-[#2B2623] md:w-60">
      <h1 className="mb-10 hidden md:block text-center text-2xl font-bold text-[#ff842f]">LOGO</h1>
      <ul className="space-y-4">
        <li>
          <Link href="/Cashierdashboard" className={`gap-3 flex p-2 rounded hover:bg-[#3d3632] hover:text-orange-500 ${isActive("/Cashierdashboard") ? "text-orange-500 font-bold" : ""}`}>
            <LayoutDashboard />
            <span className="hidden md:flex">Dashboard</span>
          </Link>
        </li>
        
        <li>
          <Link href="/Cashierdashboard/Orders" className={`gap-3 flex p-2 rounded hover:bg-[#3d3632] hover:text-orange-500 ${isActive("/Cashierdashboard/Orders") ? "text-orange-500 font-bold" : ""}`}>
            <Package/>
            <span className="hidden md:flex">Orders</span>
          </Link>
        </li>
        
        <li>
          <Link href="/Cashierdashboard/Profile" className={`gap-3 flex p-2 rounded hover:bg-[#3d3632] hover:text-orange-500 ${isActive("/Cashierdashboard/Profile") ? "text-orange-500 font-bold" : ""}`}>
            <UserRoundPen />
            <span className="hidden md:flex">Profile</span>
          </Link>
        </li>
        <li>
          <button onClick={handleSignOut} className="flex w-full gap-3 p-2 rounded hover:bg-[#3d3632] hover:text-orange-500">
            <LogOut />
            <span className="hidden md:flex">Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
