import React, { useState } from "react";

const UpdateStatusModal = ({ isOpen, onClose, onSave, currentStatus }) => {
  const [status, setStatus] = useState(currentStatus || "Pending");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
      <div className="p-8 bg-black text-gray-300 rounded-lg ">
        <div className="text-center">
          <h3 className="mb-4 text-lg font-semibold">Update Status</h3>
          <div className="flex flex-col items-start space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="Ready"
                checked={status === "Ready"}
                onChange={() => setStatus("Ready")}
                className="mr-2 text-orange-500 focus:ring-orange-500"
              />
              Ready
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="Accepted"
                checked={status === "Accepted"}
                onChange={() => setStatus("Accepted")}
                className="mr-2 text-orange-500 focus:ring-orange-500"
              />
              Accepted
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="Picked"
                checked={status === "Picked"}
                onChange={() => setStatus("Picked")}
                className="mr-2 text-orange-500 focus:ring-orange-500"
              />
              Picked
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="Cancelled"
                checked={status === "Cancelled"}
                onChange={() => setStatus("Cancelled")}
                className="mr-2 text-orange-500 focus:ring-orange-500"
              />
              Cancelled
            </label>
          </div>
          <div className="flex justify-around mt-6 gap-3">
            <button
              onClick={() => {
                onSave(status);
              }}
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
    </div>
  );
};


export default UpdateStatusModal;
