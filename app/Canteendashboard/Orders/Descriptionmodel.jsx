import React from "react";

const DescriptionModel = ({ isOpen, onClose, description, orderId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 text-white bg-gray-800 rounded-lg w-80">
        <div className="text-center">
          <h3 className="mb-4 text-lg font-semibold">Order Description</h3>
          <p className="mb-4">Order ID: {orderId}</p>
          <div className="mb-4 text-left">
            <h4 className="mb-2 font-medium">Meals:</h4>
            <ul className="space-y-2">
              {description.map((meal, index) => (
                <li key={index} className="text-sm">
                  <span className="font-semibold">{meal.mealName}</span>: {meal.mealQuantity} x ${meal.mealPrice}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionModel;
