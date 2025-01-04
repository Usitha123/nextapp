"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation";
import { signOut } from 'next-auth/react';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const isActive = (path) => pathname === path;

  return (
    <div className="w-64 h-screen p-4 text-white bg-gray-800">
      <h1 className="mb-6 text-2xl font-bold text-orange-500">LOGO</h1>
      <ul className="space-y-4">
        <li>
          <Link href="/Canteendashboard" className={`block p-2 rounded ${isActive("/Canteendashboard") ? "bg-gray-700 text-white" : "hover:bg-gray-700"}`}>
            Canteen Dashboard
          </Link>
        </li>
        <li>
          <Link href="/Canteendashboard/Meals/Breakfast" className={`block p-2 rounded ${isActive("/Canteendashboard/Meals") ? "bg-gray-700 text-white" : "hover:bg-gray-700"}`}>
            Meals
          </Link>
        </li>
        <li>
          <Link href="/Canteendashboard/Orders" className={`block p-2 rounded ${isActive("/Canteendashboard/Orders") ? "bg-gray-700 text-white" : "hover:bg-gray-700"}`}>
            Orders
          </Link>
        </li>
        <li>
          <Link href="/Canteendashboard/Reports_" className={`block p-2 rounded ${isActive("/Canteendashboard/Reports_") ? "bg-gray-700 text-white" : "hover:bg-gray-700"}`}>
            Reports
          </Link>
        </li>
        <li>
          <Link href="/Canteendashboard/Cashier" className={`block p-2 rounded ${isActive("/Canteendashboard/Cashier") ? "bg-gray-700 text-white" : "hover:bg-gray-700"}`}>
            Cashier
          </Link>
        </li>
        <li>
          <Link href="/Canteendashboard/Profile" className={`block p-2 rounded ${isActive("/Canteendashboard/Profile") ? "bg-gray-700 text-white" : "hover:bg-gray-700"}`}>
            Profile
          </Link>
        </li>
        <li>
          <button onClick={handleSignOut} className="block p-2 rounded hover:bg-gray-700">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
