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
    <div className="w-64 h-screen p-4 text-white bg-[#2B2623]">
      {/* Logo */}
      <h1 className="mb-10 mt-2 text-3xl text-center font-bold text-orange-500">LOGO</h1>

      {/* Navigation Links */}
      <ul className="space-y-4 text-md font-normal text-gray-300">
        <li>
          <Link
            href="/admindashboard"
            className={`block p-2 rounded ${
              isActive("/admindashboard") ? "font-semibold bg-[#3d3632] text-white" : "hover:bg-[#3d3632] "
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
              className="p-2 flex items-center justify-between w-full  rounded hover:bg-[#3d3632]"
            >
            Canteens
              <span>{openCanteensMenu ? "-" : "+"}</span>
            </button>
            {openCanteensMenu && (
              <div className="ml-4 space-y-1">
                <Link
                  href="/admindashboard/Canteens/AllCanteens"
                  className={`block p-2 rounded ${
                    isActive("/admindashboard/Canteens/AllCanteens") ?  "font-semibold bg-[#3d3632] text-white" : "hover:bg-[#3d3632] "
                  }`}
                >
                  All Canteens
                </Link>
                <Link
                  href="/admindashboard/Canteens/AddNew"
                  className={`block p-2 rounded ${
                    isActive("/admindashboard/Canteens/AddNew") ?  "font-semibold bg-[#3d3632] text-white" : "hover:bg-[#3d3632] "
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
              className="flex items-center justify-between w-full p-2 rounded hover:bg-[#3d3632]"
            >
              User
              <span>{openUserMenu ? "-" : "+"}</span>
            </button>
            {openUserMenu && (
              <div className="ml-4 space-y-1">
                <Link
                  href="/admindashboard/User/Owner"
                  className={`block p-2 rounded ${
                    isActive("/admindashboard/User/Owner") ?  "font-semibold bg-[#3d3632] text-white" : "hover:bg-[#3d3632] "
                  }`}
                >
                  Owner
                </Link>
                <Link
                  href="/admindashboard/User/Student"
                  className={`block p-2 rounded ${
                    isActive("/admindashboard/User/Student") ?  "font-semibold bg-[#3d3632] text-white" : "hover:bg-[#3d3632] "
                  }`}
                >
                  Student
                </Link>
                <Link
                  href="/admindashboard/User/Cashier"
                  className={`block p-2 rounded ${
                    isActive("/admindashboard/User/Cashier") ?  "font-semibold bg-[#3d3632] text-white" : "hover:bg-[#3d3632] "
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
              isActive("/admindashboard/Reports_") ?  "font-semibold bg-[#3d3632] text-white" : "hover:bg-[#3d3632] "
            }`}
          >
            Reports
          </Link>
        </li>
        <li>
          <Link
            href="/admindashboard/Profile"
            className={`block p-2 rounded ${
              isActive("/admindashboard/Profile") ?  "font-semibold bg-[#3d3632] text-white" : "hover:bg-[#3d3632] "
            }`}
          >
            Profile
          </Link>
        </li>
        <li>
          <button
            onClick={handleSignOut}
            className="block text-left p-2 w-full rounded hover:bg-orange-600 hover:text-white"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
