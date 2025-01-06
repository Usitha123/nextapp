"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';

// Cart Component
const Cart = ({ cartItems, onRemove, canteenName, username, mealType }) => {
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    const orderDetails = {
      canteenName,
      username,
      mealType,
      items: cartItems,
      subtotal,
    };
    console.log(JSON.stringify(orderDetails, null, 2));  // Logs the order details
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Your Cart</h3>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between mb-2">
            <div className="p-1">
              <span>{item.name}</span>
              <span className="mx-2">× {item.quantity}</span>
              <span className="text-orange-500">Rs: {item.price}.00</span>
            </div>
            <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700">
              <Trash2 />
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Your cart is empty.</p>
      )}
      <div className="pt-2 mt-4 border-t">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal:</span>
          <span>Rs: {subtotal}.00</span>
        </div>
        <div className="flex mt-4 space-x-4">
          <button className="flex-1 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
          <button onClick={handlePlaceOrder} className="flex-1 py-2 text-white bg-orange-500 rounded hover:bg-orange-600">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

// Food Display Component
const FoodDisplay = ({ onAddToCart }) => {
  const [isDinnerfastTime, setIsDinnerfastTime] = useState(false);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      setIsDinnerfastTime(
        (currentHour > 16 || (currentHour === 16 && currentMinute >= 0)) &&
        (currentHour < 21 || (currentHour === 21 && currentMinute === 0))
      );
    };

    checkTime();
    const timer = setInterval(checkTime, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch('/api/viewmeal');
        if (!res.ok) throw new Error('Failed to fetch meals');
        const data = await res.json();
        setMeals(data.meals);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const pathname = usePathname();
  const pathSegments = pathname?.split('/');
  const currentCanteen = pathSegments[3];  // The 4th segment is 'Skycafe'

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-4">
      {meals.filter((meal) =>
        meal.mealType === "Dinner" &&
        meal.mealstatus === "Active" &&
        meal.selectCanteen === currentCanteen
      ).map((meal) => (
        <div key={meal.id} className="w-full m-auto bg-white border rounded-3xl">
          <Image
            src={meal.image}
            alt={meal.name}
            width={800}
            height={800}
            className={`object-cover w-full rounded-3xl ${!isDinnerfastTime ? "opacity-50 blur-sm pointer-events-none" : ""}`}
            quality={100}
          />
          <div className="p-4 grid grid-cols-[auto_40px]">
            <div className="flex-col">
              <h3 className="mt-2 text-lg font-semibold">{meal.name}</h3>
              <p className="text-gray-500">Rs {meal.price}.00</p>
            </div>
            <div className="relative">
              <button
                onClick={() => onAddToCart(meal)}
                className="absolute bottom-2 right-2 w-8 h-8 text-xl text-white bg-orange-500 rounded-[50%] hover:bg-orange-600"
                disabled={!isDinnerfastTime}
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Combined Component
const CombinedComponent = () => {
  const pathname = usePathname(); 
  const dynamicPart = pathname.split("/")[3];
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [canteenName] = useState(dynamicPart);
  const [username] = useState(session?.user?.email);
  const [mealType] = useState("Dinner");

  const handleAddToCart = (food) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === food.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...food, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <div className="grid gap-8 p-4 md:grid-cols-[2fr_1fr]">
      <div><FoodDisplay onAddToCart={handleAddToCart} /></div>
      <div>
        <div className="p-4 mb-4 text-sm bg-white border border-orange-500 rounded-md shadow-sm shadow-orange-200">
          <strong>Note:</strong> You are responsible for paying the full amount of your order and collecting it.
        </div>
        <Cart
          cartItems={cartItems}
          onRemove={handleRemoveFromCart}
          canteenName={canteenName}
          username={username}
          mealType={mealType}
        />
      </div>
    </div>
  );
};

export default CombinedComponent;
