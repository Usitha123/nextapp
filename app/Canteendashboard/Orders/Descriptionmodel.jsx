import React, { useState } from "react";

const UpdateDescriptionmodel = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState("active");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 text-white bg-gray-800 rounded-lg w-80">
        <div className="text-center">
          <h3 className="mb-4 text-lg font-semibold">Description Status</h3>
          
          <div className="flex justify-end mt-6 space-x-4">
          
            <button
            onClick={() => {
              // Handle Save Action
              
              onClose();
            }}
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

export default UpdateDescriptionmodel;
