'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaRegTrashAlt, FaEdit } from 'react-icons/fa';
import Deletemealmodel from './Deletemealmodel';
import DescriptionModel from './Descriptionmodel';

const MealsTable = () => {
  const pathname = usePathname();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDescriptionModelOpen, setIsDescriptionModelOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

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

  const handleDeleteClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleDescriptionClick = (mealId) => {
    const selectedMeal = meals.find((meal) => meal._id === mealId);
    setSelectedDescription(selectedMeal?.mealDescription || '');
    setSelectedOrderId(mealId);
    setIsDescriptionModelOpen(true);
  };

  const currentMealType = pathname.split('/').pop();

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
        {tabs.map((tab) => (
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
            {meals
              .filter((meal) => meal.mealType === currentMealType)
              .map((meal) => (
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
                    <button onClick={handleDeleteClick} className="text-gray-400 hover:text-red-500">
                      <FaRegTrashAlt />
                    </button>
                    <Link href={`/Canteendashboard/Meals/Updatemeal/${meal._id}`} className="text-gray-400 hover:text-orange-500">
                      <FaEdit />
                    </Link>
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

      {/* Modals */}
      <DescriptionModel
        isOpen={isDescriptionModelOpen}
        onClose={() => setIsDescriptionModelOpen(false)}
        description={selectedDescription}
        orderId={selectedOrderId}
      />
      <Deletemealmodel isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default MealsTable;
