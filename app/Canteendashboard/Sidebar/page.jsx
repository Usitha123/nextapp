"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Package,
  BarChart3,
  Wallet,
  UserRoundPen,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
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
          <Link
            href="/Canteendashboard"
            className={`gap-3 flex p-2 rounded hover:bg-[#3d3632] hover:text-orange-500 ${isActive("/Canteendashboard") ? "text-orange-500 font-bold" : ""}`}
          >
            <LayoutDashboard />
            <span className="hidden md:flex">Dashboard</span>
          </Link>
        </li>

        <li>
          <Link
            href="/Canteendashboard/Meals/Breakfast"
            className={`gap-3 flex p-2 rounded hover:bg-[#3d3632] hover:text-orange-500 ${
              isActive("/Canteendashboard/Meals/Breakfast", [
                "/Canteendashboard/Meals/Breakfast",
                "/Canteendashboard/Meals/Lunch",
                "/Canteendashboard/Meals/Dinner"
              ])
                ? "text-orange-500 font-bold"
                : ""
            }`}
          >
            <UtensilsCrossed />
            <span className="hidden md:flex">Meals</span>
          </Link>
        </li>

        <li>
          <Link
            href="/Canteendashboard/Orders"
            className={`gap-3 flex p-2 rounded hover:bg-[#3d3632] hover:text-orange-500 ${isActive("/Canteendashboard/Orders") ? "text-orange-500 font-bold" : ""}`}
          >
            <Package />
            <span className="hidden md:flex">Orders</span>
          </Link>
        </li>

        <li>
          <Link
            href="/Canteendashboard/Reports_"
            className={`gap-3 flex p-2 rounded hover:bg-[#3d3632] hover:text-orange-500 ${isActive("/Canteendashboard/Reports_") ? "text-orange-500 font-bold" : ""}`}
          >
            <BarChart3 />
            <span className="hidden md:flex">Reports</span>
          </Link>
        </li>

        <li>
          <Link
            href="/Canteendashboard/Cashier"
            className={`gap-3 flex p-2 rounded hover:bg-[#3d3632] hover:text-orange-500 ${isActive("/Canteendashboard/Cashier") ? "text-orange-500 font-bold" : ""}`}
          >
            <Wallet />
            <span className="hidden md:flex">Cashier</span>
          </Link>
        </li>

        <li>
          <Link
            href="/Canteendashboard/Profile"
            className={`gap-3 flex p-2 rounded hover:bg-[#3d3632] hover:text-orange-500 ${isActive("/Canteendashboard/Profile") ? "text-orange-500 font-bold" : ""}`}
          >
            <UserRoundPen />
            <span className="hidden md:flex">Profile</span>
          </Link>
        </li>

        <li>
          <button
            onClick={handleSignOut}
            className="flex w-full gap-3 p-2 rounded hover:bg-[#3d3632] hover:text-orange-500"
          >
            <LogOut />
            <span className="hidden md:flex">Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
