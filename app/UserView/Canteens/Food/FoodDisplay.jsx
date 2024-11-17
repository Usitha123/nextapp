import React from "react";
import FoodItem from "./FoodItem";
import milkrice from "@/src/loginbackground.jpeg";

const food_list = [
  { _id: "1", name: "Fried Rice", image: milkrice, price: 250 },
  { _id: "2", name: "Rice", image: milkrice, price: 200 },
  { _id: "3", name: "Kottu", image: milkrice, price: 300 },
  { _id: "4", name: "Milk Rice", image: milkrice, price: 150 },
];

const FoodDisplay = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {food_list.map((food) => (
        <FoodItem key={food._id} food={food} />
      ))}
    </div>
  );
};

export default FoodDisplay;
