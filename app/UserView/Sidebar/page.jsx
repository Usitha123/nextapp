"use client";

import React from 'react';
import Link from 'next/link';
import { BoxIcon, LayoutDashboardIcon, LayoutGrid, LogOut, UserRound, Utensils } from 'lucide-react';

const Sidebar = ({ activePath }) => {
  const links = [
    { href: "/UserView", label: "Dashboard", icon: <LayoutDashboardIcon /> },
    { href: "/UserView/Canteens", label: "Canteens", icon: <Utensils /> },
    { href: "/UserView/Orders", label: "Orders", icon: <BoxIcon /> },
    { href: "/UserView/Profile", label: "Profile", icon: <UserRound /> },
    { href: "/UserView/Logout", label: "Logout", icon: <LogOut /> },
  ];

  return (
    <div className="w-20 md:w-60 h-screen p-4 text-black bg-white">
      <h1 className="mb-10 hidden md:block text-center text-2xl font-bold text-[#ff842f]">LOGO</h1>
      <ul className="space-y-4">
        {links.map((link) => {
          const isActive = activePath === link.href;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`gap-3 flex p-2 rounded hover:bg-orange-50 hover:text-orange-500 ${
                  isActive ? "text-orange-500 font-bold" : "text-black"
                }`}
              >
                <span>{link.icon}</span>
                <span className="hidden md:flex">{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
