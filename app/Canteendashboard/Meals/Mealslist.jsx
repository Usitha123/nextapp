import React, { useState } from "react";
import Link from 'next/link';
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";

const MealsTable = () => {
  const [activeTab, setActiveTab] = useState("Breakfast");

  const meals = [
    { name: "Chicken Rice", description: "Grilled chicken served with a blend of spices...", price: "350.00", quantity: 100, imageUrl: "/images/chicken-rice.jpg" },
    { name: "Vegetable Rice", description: "A nutritious mix of vegetables...", price: "200.00", quantity: 100, imageUrl: "/images/vegetable-rice.jpg" },
    { name: "Fish Noodles", description: "Noodles with a flavorful fish sauce...", price: "250.00", quantity: 100, imageUrl: "/images/fish-noodles.jpg" },
    { name: "Pasta", description: "Creamy pasta with a hint of garlic...", price: "150.00", quantity: 100, imageUrl: "/images/pasta.jpg" },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-white">Meals</h2>
      
      {/* Enable and Add Meal Buttons */}
      <div>
      <ul className="flex items-center justify-between mb-4">
        <li>
          <Link href="#" className="px-4 py-2 text-gray-900 bg-orange-500 rounded">
            Enable
          </Link>
        </li>
        <li>
          <Link href="/Canteendashboard/Meals/Addmeal" className="px-4 py-2 text-gray-900 bg-orange-500 rounded">
            Add Meal
          </Link>
        </li>
        </ul>
      </div>

      {/* Tabs for Meal Types */}
      <div className="mb-4">
        {["Breakfast", "Lunch", "Dinner"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm ${
              activeTab === tab ? "text-orange-400 font-bold" : "text-gray-400"
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Meals Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-gray-900 bg-orange-600">
            <tr>
              <th className="px-4 py-2">Meal Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="bg-gray-700">
            {meals.map((meal, index) => (
              <tr key={index} className="border-b border-gray-600">
                <td className="px-4 py-2">{meal.name}</td>
                <td className="px-4 py-2">{meal.description}</td>
                <td className="px-4 py-2">Rs: {meal.price}</td>
                <td className="px-4 py-2">{meal.quantity}</td>
                <td className="px-4 py-2">
                  <img src={meal.imageUrl} alt={meal.name} className="w-16 h-16 rounded" />
                </td>
                <td className="flex px-4 py-2 space-x-2">
                <ul>
        <li>
          <Link href="#" className="text-gray-400 hover:text-red-500">
            <FaRegTrashAlt/> 
          </Link>
        </li>
        <li>
          <Link href="/Canteendashboard/Meals/Updatemeal" className="text-gray-400 hover:text-orange-500">
             <FaEdit/>
          </Link>
        </li>
        </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button className="text-orange-400 hover:underline">Prev</button>
        <button className="text-orange-400 hover:underline">Next</button>
      </div>
    </div>
  );
};

export default MealsTable;
