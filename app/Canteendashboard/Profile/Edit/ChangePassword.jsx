import React, { useState } from "react";

const UpdateStatusModal = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState("active");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 text-white bg-gray-800 rounded-lg w-80">
        <div className="text-center">
          <h3 className="mb-4 text-lg font-semibold">Change Password</h3>
          <div className="flex flex-col items-start space-y-3">
          <div>
              <label className="block text-sm text-white">Enter Password</label>
              <input
                type="text"
                className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter Password"
              />
            </div>
            <div>
              <label className="block text-sm text-white">Confirm Password</label>
              <input
                type="text"
                className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Confirm Password"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-4">
          <button
              type="submit"
              className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-400 focus:outline-none"
            >
              Save
            </button>
            <button
            onClick={() => {
              // Handle Save Action
              
              onClose();
            }}
              type="button"
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none"
            >
              Cancel
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
