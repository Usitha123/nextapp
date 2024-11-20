"use client";

import React from "react";
import Sidebar from "../../Sidebar/page";
import Topbar from "../../Topbar/page";
import Header from "../../Header/page";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Foods from "../Foods/page";

const Page = () => {
  // Get the current path from the router
  const fullPath = usePathname();
  const currentPath = fullPath.replace("/UserView/Canteens/", ""); // Remove prefix

  // Determine the current time
  const now = new Date();
  const currentHour = now.getHours();

  // Determine the active meal based on the time
  let activeMeal = "dinner"; // Default to dinner
  if (currentHour >= 7 && currentHour < 11) {
    activeMeal = "breakfast";
  } else if (currentHour >= 11 && currentHour < 16) {
    activeMeal = "lunch";
  } else if (currentHour >= 16 && currentHour < 21) {
    activeMeal = "dinner";
  }

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
        <div className="flex px-3 m-2 space-x-4 font-semibold">
          <Link href={`/UserView/Canteens/${currentPath}`}>
            <button
              className={`hover:underline ${
                activeMeal !== "breakfast" && "cursor-not-allowed text-gray-400"
              }`}
              disabled={activeMeal !== "breakfast"}
            >
              Breakfast
            </button>
          </Link>
          <Link href={`/UserView/Canteens/${currentPath}`}>
            <button
              className={`hover:underline ${
                activeMeal !== "lunch" && "cursor-not-allowed text-gray-400"
              }`}
              disabled={activeMeal !== "lunch"}
            >
              Lunch
            </button>
          </Link>
          <Link href={`/UserView/Canteens/${currentPath}`}>
            <button
              className={`hover:underline ${
                activeMeal !== "dinner" && "cursor-not-allowed text-gray-400"
              }`}
              disabled={activeMeal !== "dinner"}
            >
              Dinner
            </button>
          </Link>
        </div>

        {/* Note */}
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
