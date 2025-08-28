import React from "react";

const DescriptionModel = ({ isOpen, onClose, description, orderId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
      <div className="p-6 bg-[#241f1d] rounded-lg shadow-lg w-80">
      <div className="text-center">
          <h3 className="mb-4 text-lg font-semibold text-orange-400">Order Description</h3>
         <p className="mb-4 text-sm text-white">Order ID: {orderId}</p>
          
          {/* Render meals */}
          <div className="mb-4 space-y-2 text-left">
            {description?.map((meal) => (
              <div key={meal._id} className="pb-1 border-b">
                <p className="font-medium text-orange-400">{meal.mealName}</p>
                <p className="text-sm text-white">
                  Qty: {meal.mealQuantity} × {meal.mealPrice}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-400 focus:outline-none"
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
