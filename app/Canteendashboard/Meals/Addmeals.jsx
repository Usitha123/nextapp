import React, { useState } from 'react';

const AddMealForm = () => {
  const [mealName, setMealName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Lunch');
  const [quantity, setQuantity] = useState('');

  const handleAddMeal = () => {
    // Add logic to handle form submission
    console.log('Meal added:', { mealName, description, price, category, quantity });
  };

  return (
    <div className="w-full max-w-lg p-8 mx-auto text-white bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Meal Name</label>
        <input
          type="text"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          className="block w-full px-3 py-2 mt-1 text-gray-100 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring focus:border-orange-500"
          placeholder="Enter meal name"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full px-3 py-2 mt-1 text-gray-100 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring focus:border-orange-500"
          placeholder="Enter description"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Price</label>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="block w-full px-3 py-2 mt-1 text-gray-100 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring focus:border-orange-500"
          placeholder="Enter price"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Image</label>
        <input
          type="file"
          className="block w-full mt-1 text-gray-300 bg-gray-900 border border-gray-700 rounded-md file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full px-3 py-2 mt-1 text-gray-100 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring focus:border-orange-500"
        >
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Breakfast">Breakfast</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="block w-full px-3 py-2 mt-1 text-gray-100 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring focus:border-orange-500"
          placeholder="Enter quantity"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
          onClick={() => console.log('Cancel')}
        >
          Cancel
        </button>
        <button
          onClick={handleAddMeal}
          className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddMealForm;
