"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

// CartItem Component
const CartItem = ({ item, onRemove }) => (
  <div className="flex items-center justify-between mb-2">
    <div className="p-1">
      <span>{item.mealName}</span>
      <span className="mx-2">× {item.quantity}</span>
      <span className="text-orange-500">
        Rs: {(item.mealPrice * item.quantity).toFixed(2)}
      </span>
    </div>
    <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700">
      <Trash2 />
    </button>
  </div>
);

// Cart Component
const Cart = ({ cartItems, onRemove, onClear, onPlaceOrder, onPlaceOrderStripe }) => {
  const [selectedOption, setSelectedOption] = useState("by_Cash");

  const subtotal = cartItems.reduce(
    (total, item) => total + item.mealPrice * item.quantity,
    0
  );
  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Your Cart</h3>

      {isCartEmpty ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <CartItem key={item.id} item={item} onRemove={onRemove} />
        ))
      )}

      <div className="pt-2 mt-4 border-t">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal:</span>
          <span>Rs: {subtotal.toFixed(2)}</span>
        </div>

        <div className="my-4">
          <h3>Choose Payment Option:</h3>
          {["by_Cash", "by_Card"].map((option) => (
            <label key={option} className="block">
              <input
                type="radio"
                value={option}
                checked={selectedOption === option}
                onChange={(e) => setSelectedOption(e.target.value)}
              />{" "}
              {option === "by_Cash" ? "By Cash" : "By Card"}
            </label>
          ))}
        </div>

        <div className="flex mt-4 space-x-4">
          <button
            onClick={onClear}
            disabled={isCartEmpty}
            className={`flex-1 py-2 rounded ${
              isCartEmpty
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() =>
              selectedOption === "by_Cash" ? onPlaceOrder() : onPlaceOrderStripe()
            }
            disabled={isCartEmpty}
            className={`flex-1 py-2 rounded ${
              isCartEmpty
                ? "bg-orange-200 text-white cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

// FoodDisplay Component
const FoodDisplay = ({ onAddToCart }) => {
  const [meals, setMeals] = useState([]);
  const [isBreakfastTime, setIsBreakfastTime] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentCanteen = usePathname()?.split("/")[3];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      setIsBreakfastTime(
        (hour > 7 || (hour === 7 && minute >= 0)) &&
        (hour < 11 || (hour === 11 && minute === 0))
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch("/api/viewmeal");
        if (!res.ok) throw new Error("Failed to fetch meals");
        const data = await res.json();
        setMeals(data.meals);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const filteredMeals = meals.filter(
    (meal) =>
      meal.mealType === "Breakfast" && meal.selectCanteen === currentCanteen
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-4">
      {filteredMeals.map((meal) => (
        <div key={meal._id} className="w-full bg-white border rounded-3xl">
          <div className="relative">
            <Image
              src={meal.image}
              alt={meal.mealName}
              width={800}
              height={800}
              quality={100}
              className={`object-cover w-full rounded-3xl ${
                !isBreakfastTime || meal.mealstatus === "Inactive"
                  ? "opacity-50 blur-sm pointer-events-none"
                  : ""
              }`}
            />
            {meal.mealstatus === "Inactive" && (
              <div className="flex justify-end mt-4 text-sm font-semibold text-red-500">
                Not Available Now
              </div>
            )}
          </div>
          <div className="p-4 grid grid-cols-[auto_40px]">
            <div className="flex-col">
              <h3 className="mt-2 text-lg font-semibold">{meal.mealName}</h3>
              <p className="text-gray-500">Rs {Number(meal.mealPrice).toFixed(2)}</p>
            </div>
            <div className="relative">
              <button
                onClick={() => onAddToCart(meal)}
                disabled={!isBreakfastTime || meal.mealstatus === "Inactive"}
                className="absolute w-8 h-8 text-xl text-white bg-orange-500 rounded-full bottom-2 right-2 hover:bg-orange-600"
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

// Main Combined Component
const CombinedComponent = () => {
  const { data: session } = useSession();
  const currentCanteen = usePathname()?.split("/")[3];
  const [cartItems, setCartItems] = useState([]);

  const generateOrderId = () => {
    const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random
    const timestampPart = Date.now().toString().slice(-4); // last 4 digits of timestamp
    return `ORD${randomPart}${timestampPart}`;
  };

  const handleAddToCart = (meal) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === meal._id);
      if (existing) {
        return prev.map((item) =>
          item.id === meal._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        id: meal._id,
        mealName: meal.mealName,
        mealPrice: Number(meal.mealPrice),
        quantity: 1,
      }];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleClearCart = () => setCartItems([]);

  const handlePlaceOrder = async () => {
    const meals = cartItems.map((item) => ({
      mealId: item.id,
      mealName: item.mealName,
      mealQuantity: item.quantity,
      mealPrice: item.mealPrice,
    }));

    const orderData = {
      userName: session?.user?.name,
      userEmail: session?.user?.email,
      canteenName: currentCanteen,
      orderId: generateOrderId(),
      orderType: "Breakfast",
      paymentStatus: "by_Cash",
      meals,
    };

    try {
      const res = await fetch("/api/addorders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        alert("Order placed successfully!");
        setCartItems([]);
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  const handlePlaceOrderStripe = async () => {
    const meals = cartItems.map((item) => ({
      mealId: item.id,
      mealName: item.mealName,
      mealQuantity: item.quantity,
      mealPrice: item.mealPrice,
    }));

    const orderData = {
      userName: session?.user?.name,
      userEmail: session?.user?.email,
      canteenName: currentCanteen,
      orderId: generateOrderId(),
      orderType: "Breakfast",
      paymentStatus: "by_Card",
      meals,
    };

    localStorage.setItem("orderData", JSON.stringify(orderData));

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: meals }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed. No redirect URL found.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="grid gap-8 p-4 md:grid-cols-[2fr_1fr]">
      <FoodDisplay onAddToCart={handleAddToCart} />
      <Cart
        cartItems={cartItems}
        onRemove={handleRemoveFromCart}
        onClear={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
        onPlaceOrderStripe={handlePlaceOrderStripe}
      />
    </div>
  );
};

export default CombinedComponent;
