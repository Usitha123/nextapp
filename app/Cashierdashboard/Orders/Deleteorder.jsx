import React from "react";

const UpdateStatusModal = ({ isOpen, onClose, student, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 text-white bg-gray-800 rounded-lg w-80">
        <div className="text-center">
          <h3 className="mb-4 text-lg font-semibold">Are you sure you want to delete this Order?</h3>
        </div>
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            type="button"
            className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-400 focus:outline-none"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
