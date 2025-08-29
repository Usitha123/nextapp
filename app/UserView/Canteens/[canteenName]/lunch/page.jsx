"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../../../Sidebar/page";
import Topbar from "../../../Topbar/page";
import Header from "../../../Header/Header";
import Foods from "./Foods/page";
import Link from "next/link";

const Page = () => {
  // Get the current path from the router
  const fullPath = usePathname();
  const nowPath = fullPath 
    ? fullPath.replace("/UserView/Canteens/", "").split("/")[0] 
    : "";
  console.log(nowPath);
  const currentPath = decodeURIComponent(nowPath);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePath={currentPath} />
      
      {/* Main Content Area */}
      <div className="pt-16 md:pt-0 md:ml-60">
        {/* Topbar - Hidden on mobile since we have the mobile header */}
        <div className="hidden md:block">
          <Topbar />
        </div>
        
        {/* Header */}
        <Header title={`${currentPath} Canteen`} />

        {/* Meal category tabs */}
        <div className="flex px-4 md:px-8 m-2 space-x-4 font-semibold overflow-x-auto">
          <Link href={`/UserView/Canteens/${currentPath}/breakfast`}>
            <button
              className={`hover:underline whitespace-nowrap ${
                fullPath?.endsWith("breakfast") ? "text-orange-500 font-bold" : ""
              }`}
            >
              Breakfast
            </button>
          </Link>
          <Link href={`/UserView/Canteens/${currentPath}/lunch`}>
            <button
              className={`hover:underline whitespace-nowrap ${
                fullPath?.endsWith("lunch") ? "text-orange-500 font-bold" : ""
              }`}
            >
              Lunch
            </button>
          </Link>
          <Link href={`/UserView/Canteens/${currentPath}/dinner`}>
            <button
              className={`hover:underline whitespace-nowrap ${
                fullPath?.endsWith("dinner") ? "text-orange-500 font-bold" : ""
              }`}
            >
              Dinner
            </button>
          </Link>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-8">
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Food Display Section */}
            <div className="flex-1">
              <Foods />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;