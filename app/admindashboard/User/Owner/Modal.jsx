import React, { useState, useEffect } from "react";

const UpdateStatusModal = ({ isOpen, onClose, owner }) => {
  const [status, setStatus] = useState(owner?.status || "active");

  useEffect(() => {
    if (owner) {
      setStatus(owner.status);
    }
  }, [owner]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/updateownerstatus?id=${owner._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }), // Ensure status is being sent correctly
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Error updating status:", errorDetails);
        alert('Failed to update status');
      } else {
        alert('Status updated successfully');
        onClose();
      }
    } catch (error) {
      console.error("Error occurred while sending request:", error);
      alert('An error occurred while updating status');
    }
  };
  

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
                className="mr-2"
              />
              Active
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={status === "inactive"}
                onChange={() => setStatus("inactive")}
                className="mr-2"
              />
              Inactive
            </label>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={handleSave}
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
