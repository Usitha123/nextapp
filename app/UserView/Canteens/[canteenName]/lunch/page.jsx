"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../../../Sidebar/page";
import Topbar from "../../../Topbar/page";
import Header from "../../../Header/page";
import Foods from "../../Foods/page";
import Link from "next/link";

const Page = () => {
  // Get the current path from the router
  const fullPath = usePathname();
const currentPath = fullPath 
  ? fullPath.replace("/UserView/Canteens/", "").split("/")[0] 
  : "";
console.log(currentPath);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed">
        <Sidebar activePath={currentPath} />
      </div>

      {/* Main content */}
      <div className="flex-1 ml-20 md:ml-60">
        <Topbar />
        <Header title={`${currentPath} Canteen`} />

        {/* Meal category tabs */}
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



        {/* Content Area */}
        <div className="flex p-4 space-x-8">
          {/* Food Display Section */}
          <div className="w-2/3">
            <Foods />
          </div>

          {/* Cart Section */}
          <div className="w-1/3">
            <div className="p-4 mb-4 text-sm bg-white border border-orange-500 rounded-md shadow-sm shadow-orange-200">
              <strong>Note:</strong> You are responsible for paying the full amount of your order and collecting it.
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
