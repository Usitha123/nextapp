import React from "react";

const DescriptionModel = ({ isOpen, onClose, description, orderId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
      <div className="w-1/3 p-6 bg-[#241f1d] text-gray-300 rounded-lg shadow-lg">
      <div className="text-center">
          <h3 className="mb-4 text-lg font-semibold">Order Description</h3>
          <p className="mb-4">Order ID: {orderId}</p>
          <br/>
          <p className="mb-4">{description}</p>

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
