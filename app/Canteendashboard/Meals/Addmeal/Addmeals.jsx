import React from "react";

const AddMealForm = () => {
  return (
    <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-[400px] mx-auto">
      <h2 className="mb-6 text-2xl font-bold">Add Meals</h2>
      <form>
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center justify-center w-24 h-24 bg-gray-600 rounded-full">
            <span className="text-sm text-gray-400">Image</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium" htmlFor="meal-name">
            Meal-Name
          </label>
          <input
            type="text"
            id="meal-name"
            className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring focus:ring-orange-500"
            placeholder="Chicken Rice"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring focus:ring-orange-500"
            placeholder="Enter meal description"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium" htmlFor="price">
            Price
          </label>
          <input
            type="text"
            id="price"
            className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring focus:ring-orange-500"
            placeholder="Rs 250.00"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring focus:ring-orange-500"
          >
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snacks</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium" htmlFor="quantity">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring focus:ring-orange-500"
            placeholder="100"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium" htmlFor="image">
            Image
          </label>
          <input
            type="file"
            id="image"
            className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-gray-700 file:text-white hover:file:bg-orange-500"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMealForm;
