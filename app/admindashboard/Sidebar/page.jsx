"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const Sidebar = () => {
  const pathname = usePathname(); // Get the current path
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openCanteensMenu, setOpenCanteensMenu] = useState(false);

  useEffect(() => {
    // Automatically open the "User" menu if the path matches any "User" submenu
    if (pathname.startsWith("/admindashboard/User")) {
      setOpenUserMenu(true);
    }

    // Automatically open the "Canteens" menu if the path matches any "Canteens" submenu
    if (pathname.startsWith("/admindashboard/Canteens")) {
      setOpenCanteensMenu(true);
    }
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const isActive = (path) => pathname === path;

  return (
    <div className="w-64 h-screen p-4 text-white bg-gray-800">
      {/* Logo */}
      <h1 className="mb-6 text-2xl font-bold text-orange-500">LOGO</h1>

      {/* Navigation Links */}
      <ul className="space-y-4">
        <li>
          <Link
            href="/admindashboard"
            className={`block p-2 rounded ${
              isActive("/admindashboard") ? "bg-gray-700 text-white" : "hover:bg-gray-700"
            }`}
          >
            Dashboard
          </Link>
        </li>

        {/* Canteens Dropdown Menu */}
        <li>
          <div className="space-y-1">
            <button
              onClick={() => setOpenCanteensMenu(!openCanteensMenu)}
              className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-700"
            >
              Canteens
              <span>{openCanteensMenu ? "-" : "+"}</span>
            </button>
            {openCanteensMenu && (
              <div className="ml-4 space-y-2">
                <Link
                  href="/admindashboard/Canteens/AllCanteens"
                  className={`block p-2 rounded ${
                    isActive("/admindashboard/Canteens/AllCanteens") ? "bg-gray-700 text-white" : "hover:bg-gray-700"
                  }`}
                >
                  All Canteens
                </Link>
                <Link
                  href="/admindashboard/Canteens/AddNew"
                  className={`block p-2 rounded ${
                    isActive("/admindashboard/Canteens/AddNew") ? "bg-gray-700 text-white" : "hover:bg-gray-700"
                  }`}
                >
                  Add New
                </Link>
              </div>
            )}
          </div>
        </li>

        {/* User Dropdown Menu */}
        <li>
          <div className="space-y-1">
            <button
              onClick={() => setOpenUserMenu(!openUserMenu)}
              className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-700"
            >
              User
              <span>{openUserMenu ? "-" : "+"}</span>
            </button>
            {openUserMenu && (
              <div className="ml-4 space-y-2">
                <Link
                  href="/admindashboard/User/Owner"
                  className={`block p-2 rounded ${
                    isActive("/admindashboard/User/Owner") ? "bg-gray-700 text-white" : "hover:bg-gray-700"
                  }`}
                >
                  Owner
                </Link>
                <Link
                  href="/admindashboard/User/Student"
                  className={`block p-2 rounded ${
                    isActive("/admindashboard/User/Student") ? "bg-gray-700 text-white" : "hover:bg-gray-700"
                  }`}
                >
                  Student
                </Link>
                <Link
                  href="/admindashboard/User/Cashier"
                  className={`block p-2 rounded ${
                    isActive("/admindashboard/User/Cashier") ? "bg-gray-700 text-white" : "hover:bg-gray-700"
                  }`}
                >
                  Cashier
                </Link>
              </div>
            )}
          </div>
        </li>

        <li>
          <Link
            href="/admindashboard/Reports_"
            className={`block p-2 rounded ${
              isActive("/admindashboard/Reports_") ? "bg-gray-700 text-white" : "hover:bg-gray-700"
            }`}
          >
            Reports
          </Link>
        </li>
        <li>
          <Link
            href="/admindashboard/Profile"
            className={`block p-2 rounded ${
              isActive("/admindashboard/Profile") ? "bg-gray-700 text-white" : "hover:bg-gray-700"
            }`}
          >
            Profile
          </Link>
        </li>
        <li>
          <button
            onClick={handleSignOut}
            className="block p-2 rounded hover:bg-gray-700"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
