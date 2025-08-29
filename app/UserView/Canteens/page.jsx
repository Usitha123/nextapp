"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/page";
import Topbar from "../Topbar/page";
import Header from "../Header/Header";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  const currentPath = usePathname();
  const [canteens, setCanteens] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        const res = await fetch("/api/allcanteenslist", {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        const activeCanteens = data.filter(
          (canteen) => canteen.ownerstatus !== "Inactive" && canteen.status === "Active"
        );
        setCanteens(activeCanteens);
      } catch (error) {
        console.error("Error fetching canteens:", error);
        setError("Failed to load canteens.");
      } finally {
        setLoading(false);
      }
    };

    fetchCanteens();
  }, []);

  const handleAddToCart = (canteen) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart, canteen];
      console.log("Updated Cart (JSON):", JSON.stringify(updatedCart, null, 2));
      return updatedCart;
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex space-x-2">
          <span className="w-2.5 h-2.5 bg-[#f76002] rounded-full animate-up-down-1"></span>
          <span className="w-2.5 h-2.5 bg-[#e85b04c4] rounded-full animate-up-down-2"></span>
          <span className="w-2.5 h-2.5 bg-[#e85b0491] rounded-full animate-up-down-3"></span>
          <span className="w-2.5 h-2.5 bg-[#e85b0456] rounded-full animate-up-down-4"></span>
        </div>
      </div>
    );

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
        <Header title="Canteens" />
        
        {/* Content */}
        <div className="p-4 md:p-8">
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {error ? (
              <div className="flex items-center justify-center h-64 text-red-500">
                <p>{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {canteens.map((canteen, index) => (
                  <div key={index} className="flex flex-col overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                    <Link href={`/UserView/Canteens/${canteen.canteenName}`}>
                      {/* Image Container */}
                      <div className="relative h-40 w-full">
                        <Image
                          src={canteen.image}
                          alt={`${canteen.canteenName} canteen`}
                          className="object-cover w-full h-full"
                          width={300}
                          height={160}
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="p-3 bg-orange-500">
                        <h3 className="text-white font-semibold text-center text-sm md:text-base leading-tight">
                          {canteen.canteenName}
                        </h3>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;