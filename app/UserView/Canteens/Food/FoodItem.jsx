import React, { useState } from "react";
import Image from "next/image";

const FoodItem = ({ food, addToCart, removeFromCart }) => {
  const [itemCount, setItemCount] = useState(0);

  const handleAdd = () => {
    setItemCount((prev) => prev + 1);
    addToCart(food._id, food); // Add to parent cart state
  };

  const handleRemove = () => {
    setItemCount((prev) => prev - 1);
    removeFromCart(food._id); // Remove from parent cart state
  };

  return (
    <div key={food._id} className="relative w-full m-auto bg-white border rounded-3xl">
      <Image
        src={food.image}
        alt={food.name}
        width={800}
        height={800}
        className="object-cover w-full rounded-3xl"
        quality={100}
        layout="responsive"
      />
      {itemCount === 0 ? (
        <button
          onClick={handleAdd}
          className="w-8 h-8 mt-2 text-2xl rounded-[50%] absolute right-6 bottom-8 text-white bg-orange-500  hover:bg-orange-600"
        >
          +
        </button>
      ) : (
        <div className="absolute bottom-8 right-6 flex items-center gap-2">
          <button
            onClick={handleRemove}
            className="w-8 h-8 text-xl text-red-700 bg-red-300 rounded-full"
          >
            -
          </button>
          <p>{itemCount}</p>
          <button
            onClick={handleAdd}
            className="w-8 h-8 text-xl text-green-700 bg-green-200 rounded-[50%]"
          >
            +
          </button>
        </div>
      )}
      <div className="p-4 grid grid-cols-[auto_40px]">
        <div className="flex-col">
          <h3 className="mt-2 text-lg font-semibold">{food.name}</h3>
          <p className="text-gray-500">Rs {food.price}.00</p>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;