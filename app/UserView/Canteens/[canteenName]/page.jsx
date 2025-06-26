"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; // Import Next.js navigation hooks
import Sidebar from "../../Sidebar/page";
import Topbar from "../../Topbar/page";
import Header from "../../Header/Header";
import Foods from "./lunch/Foods/page";

const Page = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path to extract dynamic parts

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();

    let mealPath = "dinner"; // Default to dinner
    if (currentHour >= 7 && currentHour < 11) {
      mealPath = "breakfast";
    } else if (currentHour >= 11 && currentHour < 16) {
      mealPath = "lunch";
    } else if (currentHour >= 16 && currentHour < 21) {
      mealPath = "dinner";
    }

    // Extract the dynamic part (e.g., canteenId) from the current path
    const dynamicPart = pathname.split("/")[3]; // Assuming '/UserView/Canteens/[canteenId]'

    // Redirect to the appropriate meal path
    if (dynamicPart) {
      router.push(`/UserView/Canteens/${dynamicPart}/${mealPath}`);
    }
  }, [router, pathname]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed">
        <Sidebar activePath="/UserView/Canteens" />
      </div>

      {/* Main content */}
      <div className="flex-1 ml-20 md:ml-60">
        <Topbar />
        <Header title="Canteen" />
        
      </div>
    </div>
  );
};

export default Page;
