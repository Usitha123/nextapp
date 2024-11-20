"use client";

import React from 'react';
import Sidebar from '../../Sidebar/page';
import Topbar from '../../Topbar/page';
import Header from '../../Header/page';
import { usePathname } from 'next/navigation';
import Link from 'next/link'; // Added this import
import Cart from '../Cart/Cart';
import FoodDisplay from '../Food/FoodDisplay';

const Page = () => {
  // Get the current path from the router
  const fullPath = usePathname();
  const currentPath = fullPath.replace('/UserView/Canteens/', ''); // Remove prefix

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed">
        <Sidebar activePath="/UserView/Canteens" />
      </div>

      {/* Main content */}
      <div className="flex-1 ml-20 md:ml-60">
        <Topbar />

        {/* Pass the modified path as the header title */}
        <Header title={`${currentPath} Canteen`} />

        {/* Tabs for meal categories */}
        <div className="flex flex-wrap"></div>
        <div className="flex px-3 m-2 space-x-4 font-semibold">
          <Link href={`/UserView/Canteens/${currentPath}/breakfast`}>
            <button className="hover:underline">Breakfast</button>
          </Link>
          <Link href={`/UserView/Canteens/${currentPath}/lunch`}>
            <button className="hover:underline">Lunch</button>
          </Link>
          <Link href={`/UserView/Canteens/${currentPath}/dinner`}>
            <button className="hover:underline">Dinner</button>
          </Link>
        </div>

        {/* Note */}
        <div className="flex p-4 space-x-8">
          {/* Food Display Section */}
          <div className="w-2/3">
            <FoodDisplay />
          </div>

          {/* Cart Section */}
          <div className="w-1/3">
            <div className="p-4 mb-4 text-sm bg-white border border-orange-500 rounded-md shadow-sm shadow-orange-200">
              <strong>Note:</strong> You are responsible for paying the full amount of your order and collecting it.
            </div>
            <Cart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
