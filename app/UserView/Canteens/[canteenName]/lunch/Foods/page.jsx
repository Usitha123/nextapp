"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";

const CartItem = ({ item, onRemove }) => (
  <div key={item.id} className="flex items-center justify-between mb-2">
    <div className="p-1">
      <span>{item.mealName}</span>
      <span className="mx-2">× {item.quantity}</span>
      <span className="text-orange-500">Rs: {(Number(item.mealPrice) * item.quantity).toFixed(2)}</span>
    </div>
    <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700">
      <Trash2 />
    </button>
  </div>
);

const Cart = ({ cartItems, onRemove, onClear }) => {
  const subtotal = cartItems.reduce((total, item) => total + Number(item.mealPrice) * item.quantity, 0);

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Your Cart</h3>
      {cartItems.length > 0 ? (
        cartItems.map((item) => <CartItem key={item.id} item={item} onRemove={onRemove} />)
      ) : (
        <p className="text-gray-500">Your cart is empty.</p>
      )}
      <div className="pt-2 mt-4 border-t">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal:</span>
          <span>Rs: {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex mt-4 space-x-4">
          <button 
            onClick={onClear}
            className="flex-1 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button className="flex-1 py-2 text-white bg-orange-500 rounded hover:bg-orange-600">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

const FoodDisplay = ({ onAddToCart }) => {
  const [meals, setMeals] = useState([]);
  const [isDinnerfastTime, setIsDinnerfastTime] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    setIsDinnerfastTime(
      (currentHour > 11 || (currentHour === 11 && currentMinute >= 0)) &&
      (currentHour < 16 || (currentHour === 16 && currentMinute === 0))
    );
  };

  useEffect(() => {
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

  const pathname = usePathname();  // Gets the full URL path
  const pathSegments = pathname?.split('/');  // Split the path into an array
  const currentCanteen = pathSegments[3];  // The 4th segment is 'Skycafe'
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-4">
      {meals.filter((meal) => 
        meal.mealType === "Lunch" && 
        meal.mealstatus === "Active" && 
        meal.selectCanteen === currentCanteen
      ).map((meal) => (
        <div key={meal._id} className="w-full m-auto bg-white border rounded-3xl">
          <Image
            src={meal.image}
            alt={meal.mealName}
            width={800}
            height={800}
            className={`object-cover w-full rounded-3xl ${!isDinnerfastTime ? "opacity-50 blur-sm pointer-events-none" : ""}`}
            quality={100}
          />
          <div className="p-4 grid grid-cols-[auto_40px]">
            <div className="flex-col">
              <h3 className="mt-2 text-lg font-semibold">{meal.mealName}</h3>
              <p className="text-gray-500">Rs {Number(meal.mealPrice).toFixed(2)}</p>
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

const CombinedComponent = () => {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (meal) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === meal._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === meal._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { 
        id: meal._id, 
        mealName: meal.mealName, 
        mealPrice: Number(meal.mealPrice), 
        quantity: 1 
      }];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === id);
      
      if (!existingItem) return prevItems;
      
      if (existingItem.quantity === 1) {
        return prevItems.filter(item => item.id !== id);
      }
      
      return prevItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="grid gap-8 p-4 md:grid-cols-[2fr_1fr]">
      <div>
        <FoodDisplay onAddToCart={handleAddToCart} />
      </div>
      <div>
        <div className="p-4 mb-4 text-sm bg-white border border-orange-500 rounded-md shadow-sm shadow-orange-200">
          <strong>Note:</strong> You are responsible for paying the full amount
          of your order and collecting it.
        </div>
        <Cart 
          cartItems={cartItems} 
          onRemove={handleRemoveFromCart} 
          onClear={handleClearCart}
        />
      </div>
    </div>
  );
};

export default CombinedComponent;