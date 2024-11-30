"use client";
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image';
import milkrice from '@/src/loginbackground.jpeg';

const Cart = ({ cartItems, onRemove }) => {
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Your Cart</h3>
      {cartItems.length > 0 ? (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between mb-2">
              <div className="p-1">
                <span>{item.name}</span>
                <span className="mx-2">× {item.quantity}</span>
                <span className="text-orange-500">Rs: {item.price}.00</span>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Your cart is empty.</p>
      )}
      <div className="pt-2 mt-4 border-t">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal:</span>
          <span>Rs: {subtotal}.00</span>
        </div>
        <div className="flex mt-4 space-x-4">
          <button className="flex-1 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-400">
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
  const food_list = [
    { id: '1', name: 'Fried Rice', image: milkrice, price: 250 },
    { id: '2', name: 'Rice', image: milkrice, price: 200 },
    { id: '3', name: 'Kottu', image: milkrice, price: 300 },
    { id: '4', name: 'Milk Rice', image: milkrice, price: 150 },
    { id: '5', name: 'Fried Rice', image: milkrice, price: 250 },
    { id: '6', name: 'Rice', image: milkrice, price: 200 },
    { id: '7', name: 'Kottu', image: milkrice, price: 300 },
    { id: '8', name: 'Milk Rice', image: milkrice, price: 150 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {food_list.map((food) => (
        <div key={food.id} className="w-full m-auto bg-white border rounded-3xl">
          <Image
            src={food.image}
            alt={food.name}
            width={800}
            height={800}
            className="object-cover w-full rounded-3xl"
            quality={100}
            layout="responsive"
          />
          <div className="p-4 grid grid-cols-[auto_40px]">
            <div className="flex-col">
              <h3 className="mt-2 text-lg font-semibold">{food.name}</h3>
              <p className="text-gray-500">Rs {food.price}.00</p>
            </div>
            <div>
              <button
                onClick={() => onAddToCart(food)}
                className="px-4 py-1 mt-2 text-white bg-orange-500 rounded hover:bg-orange-600"
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
    <div className="grid gap-8 p-4 md:grid-cols-2">
      <FoodDisplay onAddToCart={handleAddToCart} />
      <Cart cartItems={cartItems} onRemove={handleRemoveFromCart} />
    </div>
  );
};

export default CombinedComponent;
