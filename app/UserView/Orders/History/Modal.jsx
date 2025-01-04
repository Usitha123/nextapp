import React, { useState } from "react";

const UpdateStatusModal = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState("ready");

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
                value="ready"
                checked={status === "ready"}
                onChange={() => setStatus("ready")}
                className="mr-2 text-orange-500 focus:ring-orange-500"
              />
              Ready
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="accepted"
                checked={status === "accepted"}
                onChange={() => setStatus("accepted")}
                className="mr-2 text-orange-500 focus:ring-orange-500"
              />
              Accepted
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="picked"
                checked={status === "picked"}
                onChange={() => setStatus("picked")}
                className="mr-2 text-orange-500 focus:ring-orange-500"
              />
              Picked
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="cancelled"
                checked={status === "cancelled"}
                onChange={() => setStatus("cancelled")}
                className="mr-2 text-orange-500 focus:ring-orange-500"
              />
              Cancelled
            </label>
          </div>
          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={() => {
                console.log(`Status updated to: ${status}`);
                onClose();
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
