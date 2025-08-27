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
const currentPath = decodeURIComponent(nowPath)

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
            <button
              className={`hover:underline ${fullPath?.endsWith("breakfast") ? "text-orange-500 font-bold" : ""
                }`}
            >
              Breakfast
            </button>
          </Link>
          <Link href={`/UserView/Canteens/${currentPath}/lunch`}>
            <button
              className={`hover:underline ${fullPath?.endsWith("lunch") ? "text-orange-500" : ""
                }`}
            >
              Lunch
            </button>
          </Link>
          <Link href={`/UserView/Canteens/${currentPath}/dinner`}>
            <button
              className={`hover:underline ${fullPath?.endsWith("dinner") ? "text-orange-500" : ""
                }`}
            >
              Dinner
            </button>
          </Link>
        </div>




        {/* Content Area */}
        <div className="flex flex-col gap-8 p-4 lg:flex-row">
          {/* Food Display Section */}
          <div className="flex-1">
            <Foods />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
