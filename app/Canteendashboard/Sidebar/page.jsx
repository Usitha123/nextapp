"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation";
import { signOut } from 'next-auth/react';

const Sidebar = () => {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const isActive = (path) => pathname === path;

  const menuItems = [
    { href: "/Canteendashboard", label: "Canteen Dashboard" },
    { href: "/Canteendashboard/Meals/Breakfast", label: "Meals", subPaths: ["/Canteendashboard/Meals/Breakfast", "/Canteendashboard/Meals/Lunch", "/Canteendashboard/Meals/Dinner"] },
    { href: "/Canteendashboard/Orders", label: "Orders" },
    { href: "/Canteendashboard/Reports_", label: "Reports" },
    { href: "/Canteendashboard/Cashier", label: "Cashier" },
    { href: "/Canteendashboard/Profile", label: "Profile" },
  ];

  return (
    <div className="w-64 h-screen p-4 text-white bg-gray-800">
      <h1 className="mb-6 text-2xl font-bold text-orange-500">LOGO</h1>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block p-2 rounded ${isActive(item.href) || (item.subPaths && item.subPaths.some((subPath) => isActive(subPath))) ? "bg-gray-700 text-white" : "hover:bg-gray-700"}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
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
