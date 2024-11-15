"use client";

import React from 'react';
import Sidebar from '../../Sidebar/page';
import Topbar from '../../Topbar/page';
import Header from '../../Header/page';
import { usePathname } from 'next/navigation';
import Cart from '../Cart/Cart';
import FoodDisplay from '../Food/FoodDisplay';
import Breadcrumb from '../Breadcrumb';

const Page = () => {
  const fullPath = usePathname();
  const currentPath = fullPath.replace('/UserView/Canteens/', ''); // Remove prefix

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="fixed">
        <Sidebar activePath={"/UserView/Canteens"} />
      </div>

      <div className="flex-1 ml-20 md:ml-60">
        <Topbar />
        <Breadcrumb/>

        {/* Pass the modified path as the header title */}
        <Header title={`${currentPath} Canteen`} />

        {/* Tabs for meal categories */}
        <div className="flex flex-wrap"></div>
        <div className="flex px-3 m-2 space-x-4 font-semibold">
          <button className="hover:underline">Breakfast</button>
          <button className="hover:underline">Lunch</button>
          <button className="hover:underline">Dinner</button>
        </div>

        {/* Note */}
        <div className="flex p-4 space-x-8">
          {/* Food display */}
          <div className="w-2/3">
            <FoodDisplay />
          </div>

          {/* Cart */}
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
