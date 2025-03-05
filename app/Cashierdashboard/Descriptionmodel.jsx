import React from "react";

const DescriptionModel = ({ isOpen, onClose, description, orderId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm ">
      <div className="p-6 bg-black text-gray-300  rounded-lg w-80">
        <div className="text-center">
          <h3 className="mb-6 text-lg font-semibold">Order Description</h3>
          <p className="mb-4">Order ID: {orderId}</p>
          <p className="mb-4">{description}</p>

          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={onClose}
              type="button"
              className="px-6 py-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black"
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
