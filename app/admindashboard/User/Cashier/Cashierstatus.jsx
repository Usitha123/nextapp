import React, { useState } from "react";

const UpdateStatusModal = ({ isOpen, onClose, onSave }) => {
  const [status, setStatus] = useState("Active");

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
                value="Active"
                checked={status === "Active"}
                onChange={() => setStatus("Active")}
                className="mr-2 text-orange-500 focus:ring-orange-500"
              />
              Active
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="Inactive"
                checked={status === "Inactive"}
                onChange={() => setStatus("Inactive")}
                className="mr-2 text-orange-500 focus:ring-orange-500"
              />
              Block
            </label>
          </div>
          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={() => {
                onSave(status);
              }}
              type="button"
              className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-400 focus:outline-none"
            >
              Save
            </button>
            <button
              onClick={onClose}
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
