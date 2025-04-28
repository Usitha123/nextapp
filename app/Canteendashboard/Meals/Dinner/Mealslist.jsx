'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaRegTrashAlt, FaEdit } from 'react-icons/fa';
import Deletemealmodel from './Deletemealmodel';
import DescriptionModel from './Descriptionmodel';
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";

const MealsTable = () => {
  const pathname = usePathname();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDescriptionModelOpen, setIsDescriptionModelOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedMealId, setSelectedMealId] = useState(null);
  const { data: session } = useSession();
  

  const tabs = [
    { label: 'Breakfast', href: '/Canteendashboard/Meals/Breakfast' },
    { label: 'Lunch', href: '/Canteendashboard/Meals/Lunch' },
    { label: 'Dinner', href: '/Canteendashboard/Meals/Dinner' },
  ];

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch('/api/viewmeal');
        if (!res.ok) throw new Error('Failed to fetch meals');
        const { meals } = await res.json();
        setMeals(meals);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const handleDeleteOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/deletemeal?id=${selectedMealId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMeals(meals.filter((meal) => meal._id !== selectedMealId));
      } else {
        alert("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("An error occurred while deleting the order");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleDeleteClick = (mealId) => {
    setSelectedMealId(mealId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleDescriptionClick = (mealId) => {
    const selectedMeal = meals.find((meal) => meal._id === mealId);
    setSelectedDescription(selectedMeal?.mealDescription || '');
    setSelectedOrderId(mealId);
    setIsDescriptionModelOpen(true);
  };

  const currentMealType = pathname.split('/').pop();

  return (
    <div className="p-4">
  
      {/* Action Buttons */}
      <div className="flex justify-between gap-2 mb-4">
        
        <Link
          href="/Canteendashboard/Meals/Addmeal"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
        >
          Add Meal
        </Link>
      </div>
  
      {/* Meal Type Tabs */}
      <div className="flex mb-4 space-x-6">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`py-2 text-sm rounded-xl ${
              pathname === tab.href
                ? "text-orange-500"
                : "text-gray-400 hover:text-white transition"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
  
      {/* Meals Table */}
      <div className="overflow-auto justify-center max-w-[75vw] lg:max-w-full rounded-xl">
        <table className="w-full text-sm text-left text-gray-400 rounded-xl bg-[#2B2623]">
          <thead className="text-gray-900 bg-orange-500">
            <tr>
              <th className="px-4 py-2">Meal Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {meals
              .filter((meal) => meal.mealType === currentMealType)
              .filter((meal) => session?.user?.canteenName === meal.selectCanteen)
              .map((meal) => (
                <tr key={meal._id} className="border-b-2 border-[#3B3737]">
                  <td className="px-4 py-2">{meal.mealName}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDescriptionClick(meal._id)}
                      className="text-orange-400 hover:underline"
                    >
                      View
                    </button>
                  </td>
                  <td className="px-4 py-2">Rs: {meal.mealPrice}</td>
                  <td className="px-4 py-2">{meal.mealQuantity}</td>
                  <td className="px-4 py-2">{meal.mealstatus}</td>
                  <td className="px-4 py-2">
                    <img
                      src={meal.image}
                      alt={`Image of ${meal.mealName}`}
                      className="w-16 h-16 rounded"
                    />
                  </td>
                  <td className="px-4 py-2 align-middle">
                    <div className="flex items-center h-full space-x-2">
                      <button
                        onClick={() => handleDeleteClick(meal._id)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label={`Delete ${meal.mealName}`}
                      >
                        <FaRegTrashAlt />
                      </button>
                      <Link
                        href={`/Canteendashboard/Meals/Updatemeal?id=${meal._id}`}
                        className="text-gray-400 hover:text-orange-500"
                        aria-label={`Edit ${meal.mealName}`}
                      >
                        <FaEdit />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
  
      {/* Pagination */}
      <div className="flex items-center justify-end gap-2 mt-4 text-sm">
        <button className="flex items-center gap-1 px-3 py-1 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition">
          <ChevronLeft />
          Prev
        </button>
        <button className="flex items-center gap-1 px-3 py-1 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition">
          Next
          <ChevronRight />
        </button>
      </div>
  
      {/* Modals */}
      <DescriptionModel
        isOpen={isDescriptionModelOpen}
        onClose={() => setIsDescriptionModelOpen(false)}
        description={selectedDescription}
        orderId={selectedOrderId}
      />
  
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 text-white bg-[#2B2623] rounded-lg w-80 shadow-md">
            <div className="text-center">
              <h3 className="mb-4 text-lg font-semibold">
                Are you sure you want to delete?
              </h3>
            </div>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={handleDeleteOrder}
                type="button"
                className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-400 focus:outline-none"
              >
                Yes
              </button>
              <button
                onClick={handleCloseModal}
                type="button"
                className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default MealsTable;
