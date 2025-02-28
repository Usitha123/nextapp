'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaRegTrashAlt, FaEdit } from 'react-icons/fa';
import Deletemealmodel from './Deletemealmodel';
import DescriptionModel from './Descriptionmodel';
import { useSession } from "next-auth/react";

const MEAL_TABS = [
  { label: 'Breakfast', href: '/Canteendashboard/Meals/Breakfast' },
  { label: 'Lunch', href: '/Canteendashboard/Meals/Lunch' },
  { label: 'Dinner', href: '/Canteendashboard/Meals/Dinner' },
];

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

  const currentMealType = pathname.split('/').pop();

  const fetchMeals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/viewmeal');
      if (!res.ok) throw new Error('Failed to fetch meals');
      const { meals } = await res.json();
      setMeals(meals);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const handleDeleteOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/deletemeal?id=${selectedMealId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setMeals(prevMeals => prevMeals.filter(meal => meal._id !== selectedMealId));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete meal');
      }
    } catch (error) {
      console.error("Error deleting meal:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleDeleteClick = (mealId) => {
    setSelectedMealId(mealId);
    setIsModalOpen(true);
  };

  const handleDescriptionClick = (mealId) => {
    const selectedMeal = meals.find((meal) => meal._id === mealId);
    setSelectedDescription(selectedMeal?.mealDescription || '');
    setSelectedOrderId(mealId);
    setIsDescriptionModelOpen(true);
  };

  const filteredMeals = meals
    .filter((meal) => meal.mealType === currentMealType)
    .filter((meal) => session?.user?.canteenName === meal.selectCanteen);

  if (error) {
    return <div className="p-6 text-red-500 bg-gray-800 rounded-lg shadow-lg">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-white">Meals</h2>

      {/* Action Buttons */}
      <div className="flex justify-between mb-4">
        <Link href="#" className="px-4 py-2 text-gray-900 bg-orange-500 rounded">
          Enable
        </Link>
        <Link href="/Canteendashboard/Meals/Addmeal" className="px-4 py-2 text-gray-900 bg-orange-500 rounded">
          Add Meal
        </Link>
      </div>

      {/* Meal Type Tabs */}
      <div className="flex mb-4 space-x-2">
        {MEAL_TABS.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`px-4 py-2 text-sm ${pathname === tab.href ? 'text-white bg-orange-500' : 'text-gray-400 hover:text-white'}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Meals Table */}
      {loading ? (
        <div className="py-4 text-center text-gray-400">Loading meals...</div>
      ) : filteredMeals.length === 0 ? (
        <div className="py-4 text-center text-gray-400">No meals found for this category</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-gray-900 bg-orange-600">
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
            <tbody className="bg-gray-700">
              {filteredMeals.map((meal) => (
                <tr key={meal._id} className="border-b border-gray-600">
                  <td className="px-4 py-2">{meal.mealName}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleDescriptionClick(meal._id)} className="text-orange-400 hover:underline">
                      View
                    </button>
                  </td>
                  <td className="px-4 py-2">Rs: {meal.mealPrice}</td>
                  <td className="px-4 py-2">{meal.mealQuantity}</td>
                  <td className="px-4 py-2">{meal.mealstatus}</td>
                  <td className="px-4 py-2">
                    <img src={meal.image} alt={`Image of ${meal.mealName}`} className="w-16 h-16 rounded" />
                  </td>
                  <td className="flex items-center px-4 py-2 space-x-2">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button className="text-orange-400 hover:underline">Prev</button>
        <button className="text-orange-400 hover:underline">Next</button>
      </div>

      {/* Description Modal */}
      <DescriptionModel
        isOpen={isDescriptionModelOpen}
        onClose={() => setIsDescriptionModelOpen(false)}
        description={selectedDescription}
        orderId={selectedOrderId}
      />
      
      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 text-white bg-gray-800 rounded-lg w-80">
            <div className="text-center">
              <h3 className="mb-4 text-lg font-semibold">Are you sure you want to delete?</h3>
            </div>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={handleDeleteOrder}
                type="button"
                className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-400 focus:outline-none"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Yes'}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
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