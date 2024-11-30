"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/page";
import Topbar from "../Topbar/page";
import Header from "../Header/page";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  const currentPath = usePathname();
  const [canteens, setCanteens] = useState([]);
  const [cart, setCart] = useState([]); // Cart state
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

  // Handler for adding to cart
  const handleAddToCart = (canteen) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart, canteen];
      console.log("Updated Cart (JSON):", JSON.stringify(updatedCart, null, 2)); // Log the cart as JSON
      return updatedCart;
    });
  };

  // Log cart changes (optional)
  useEffect(() => {
    console.log("Cart updated:", cart);
  }, [cart]);

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

  if (error) return <div>{error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activePath={currentPath} />
      <div className="flex-1 ml-20 md:ml-60">
        <Topbar />
        <Header title="Canteens" />
        <div className="max-h-[70%] m-5">
          <div className="grid justify-between w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {canteens.map((canteen, index) => (
              <div key={index} className="flex flex-col my-auto text-xl font-medium leading-none text-center text-white">
                <Link href={`/UserView/Canteens/${canteen.canteenName}`}>
                  <div className="flex flex-col pt-3.5 h-[220px] rounded-t-3xl bg-white">
                    <Image
                      src={canteen.image}
                      alt={`${canteen.canteenName} canteen`}
                      className="object-contain mx-auto"
                      width={200} // Adjust as needed
                      height={200} // Adjust as needed
                      loading="lazy"
                    />
                  </div>
                </Link>
                <div className="rounded-b-xl py-2 bg-orange-500 min-h-[40px]">
                  {canteen.canteenName}
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
