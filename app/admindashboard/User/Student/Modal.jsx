import React, { useState } from "react";

const UpdateStatusModal = ({ isOpen, onClose, onSave }) => {
  const [status, setStatus] = useState("Active");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
      <div className="p-6 bg-black text-gray-300 rounded-lg shadow-lg">
        <h3 className="mb-6 font-semibold text-center">Update Status</h3>
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
        <div className="flex justify-around mt-6 gap-3">
          <button
            onClick={() => onSave(status)}
            type="button"
            className="px-6 py-2 text-sm font-medium bg-orange-500 text-black rounded-xl hover:bg-orange-600"
          >
            Save
          </button>
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
