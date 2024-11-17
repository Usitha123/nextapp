import React, { useState } from "react";
import Image from "next/image";

const FoodItem = ({ food }) => {
  const [itemCount, setItemCount] = useState(0);

  return (
    <div key={food._id} className="relative w-full m-auto bg-white border rounded-3xl">
      <Image
        src={food.image}
        alt={food.name}
        width={800} // Set a higher width for better quality
        height={800} // Set a higher height to maintain aspect ratio
        className="object-cover w-full rounded-3xl"
        quality={100} // Ensures maximum image quality
        layout="responsive"
      />
      {itemCount === 0 ? (
        
          <button
            onClick={() => setItemCount((prev) => prev + 1)}
            className="w-8 h-8 mt-2 text-2xl rounded-[50%] absolute right-6 bottom-8 text-white bg-orange-500  hover:bg-orange-600"
          >
            +
          </button>
       
      ) : (
        <div className="absolute bottom-8 right-6 flex items-center gap-2 transition ease-in-out duration-500 "> 
          <button
            onClick={() => setItemCount((prev) => prev - 1)}
            className="w-8 h-8  text-xl text-red-700 bg-red-300 rounded-full"
          >
            -
          </button>
          <p>{itemCount}</p>
          <button
            onClick={() => setItemCount((prev) => prev + 1)}
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
