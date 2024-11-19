import React, { useState } from "react";
import FoodItem from "./FoodItem"; // Adjust import based on your file structure

const FoodList = () => {
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
    <div>
      <div className="grid grid-cols-2 gap-4">
        {/* Pass down handlers and current cart info */}
        <FoodItem
          food={{ _id: 1, name: "Burger", price: 200, image: "/burger.jpg" }}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
        <FoodItem
          food={{ _id: 2, name: "Pizza", price: 500, image: "/pizza.jpg" }}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </div>

      {/* Display Cart */}
      <div className="mt-8">
        <h2>Cart Items</h2>
        {cartItems.map((item) => (
          <div key={item.id}>
            <p>
              {item.name} x {item.quantity} = Rs {item.price * item.quantity}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodList;