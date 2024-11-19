"use client";

import React, { useState } from "react";
import Sidebar from "../../Sidebar/page";
import Topbar from "../../Topbar/page";
import Header from "../../Header/page";
import { usePathname } from "next/navigation";
import Cart from "../Cart/Cart";
import FoodItem from "../Food/FoodItem";
import milkrice from "@/src/loginbackground.jpeg";

const food_list = [
  { _id: "1", name: "Fried Rice", image: milkrice, price: 250 },
  { _id: "2", name: "Rice", image: milkrice, price: 200 },
  { _id: "3", name: "Kottu", image: milkrice, price: 300 },
  { _id: "4", name: "Milk Rice", image: milkrice, price: 150 },
];

const Page = () => {
  const fullPath = usePathname();
  const currentPath = fullPath.replace("/UserView/Canteens/", ""); // Remove prefix

  // Cart state and handlers
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (foodId, foodDetails) => {
    setCartItems((prev) => {
      const itemExists = prev.find((item) => item.id === foodId);

      if (itemExists) {
        return prev.map((item) =>
          item.id === foodId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { id: foodId, ...foodDetails, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (foodId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === foodId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed">
        <Sidebar activePath="/UserView/Canteens" />
      </div>

      <div className="flex-1 ml-20 md:ml-60">
        <Topbar />
        {/* Header */}
        <Header title={`${currentPath} Canteen`} />

        {/* Tabs for meal categories */}
        <div className="flex px-3 m-2 space-x-4 font-semibold">
          <button className="hover:underline">Breakfast</button>
          <button className="hover:underline">Lunch</button>
          <button className="hover:underline">Dinner</button>
        </div>

        <div className="flex p-4 space-x-8">
          {/* Food display */}
          <div className="w-2/3">
            <div className="grid gap-4 md:grid-cols-2">
              {food_list.map((food) => (
                <FoodItem
                  key={food._id}
                  food={food}
                  addToCart={(id) => handleAddToCart(id, food)}
                  removeFromCart={handleRemoveFromCart}
                />
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="w-1/3">
            <div className="p-4 mb-4 text-sm bg-white border border-orange-500 rounded-md shadow-sm shadow-orange-200">
              <strong>Note:</strong> You are responsible for paying the full amount of your order and collecting it.
            </div>
            <Cart cartItems={cartItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
