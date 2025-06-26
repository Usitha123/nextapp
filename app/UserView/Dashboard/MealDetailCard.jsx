"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MealDetailCard({ name, canteen, image, price }) {
  const router = useRouter();

  const handleAddClick = () => {
    // Get current hour to determine meal type
    const hour = new Date().getHours();
    let mealType = "dinner"; // default
    
    if (hour >= 7 && hour < 11) mealType = "breakfast";
    else if (hour >= 11 && hour < 16) mealType = "lunch";
    
    // Navigate to the canteen page with the current meal type
    router.push(`/UserView/Canteens/${encodeURIComponent(canteen)}/${mealType}`);
  };

  return (
    <div className="overflow-hidden bg-white shadow-md rounded-xl">
      <div className="relative h-40">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex items-center justify-between p-4">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-600">{canteen}</p>
          <p className="text-sm text-orange-500">Rs. {price}</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="w-10 h-10 flex items-center justify-center bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
          aria-label="Add item"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path 
              d="M12 5V19M5 12H19" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
} 