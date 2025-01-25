import React, { useState } from "react";

const UpdateStatusModal = ({ isOpen, currentStatus, onClose, onStatusUpdate }) => {
  const [status, setStatus] = useState(currentStatus); // Initial state from currentStatus

  if (!isOpen) return null;

  const handleStatusEdit = () => {
    if (status === currentStatus) {
      alert("No changes made to the status.");
      return;
    }
    onStatusUpdate(status);
    onClose(); // Close the modal after update
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 text-white bg-gray-800 rounded-lg w-80">
        <h3 className="mb-4 text-lg font-semibold">Update Status</h3>
        <div className="flex flex-col space-y-3">
          <label>
            <input
              type="radio"
              name="status"
              value="Active"
              checked={status === "Active"}
              onChange={(e) => setStatus(e.target.value)}
            />
            Active
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="Inactive"
              checked={status === "Inactive"}
              onChange={(e) => setStatus(e.target.value)}
            />
            Inactive
          </label>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handleStatusEdit}
            className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-400"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
