"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="w-64 h-screen p-4 text-white bg-gray-800">
      <h1 className="mb-6 text-2xl font-bold text-orange-500">LOGO</h1>
      <ul className="space-y-4">
        {/* Correct usage of Link without <a> */}
        <li>
          <Link href="/admindashboard" className="block p-2 rounded hover:bg-gray-700">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/admindashboard/Canteens" className="block p-2 rounded hover:bg-gray-700">
            Canteens
          </Link>
        </li>
        <li>
          <Link href="/admindashboard/User" className="block p-2 rounded hover:bg-gray-700">
            User
          </Link>
        </li>
        <li>
          <Link href="/admindashboard/Reports_" className="block p-2 rounded hover:bg-gray-700">
            Reports
          </Link>
        </li>
        <li>
          <Link href="/admindashboard/Profile" className="block p-2 rounded hover:bg-gray-700">
            Profile
          </Link>
        </li>
        <li>
          <Link href="/admindashboard/Logout" className="block p-2 rounded hover:bg-gray-700">
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
