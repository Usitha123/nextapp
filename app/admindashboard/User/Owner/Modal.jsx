import React, { useState } from "react";

const UpdateStatusModal = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState("active");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 text-white bg-gray-800 rounded-lg w-80">
        <div className="text-center">
          <h3 className="mb-4 text-lg font-semibold">Update Status</h3>
          <div className="flex flex-col items-start space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="active"
                checked={status === "active"}
                onChange={() => setStatus("active")}
                className="mr-2 text-orange-500 focus:ring-orange-500"
              />
              Active
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="block"
                checked={status === "block"}
                onChange={() => setStatus("block")}
                className="mr-2 text-orange-500 focus:ring-orange-500"
              />
              Block
            </label>
          </div>
          <button
            onClick={() => {
              // Handle Save Action
              console.log("Status Updated to:", status);
              onClose();
            }}
            className="px-4 py-2 mt-6 text-white bg-orange-500 rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
