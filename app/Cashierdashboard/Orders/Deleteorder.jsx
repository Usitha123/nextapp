import React from "react";

const UpdateStatusModal = ({ isOpen, onClose, student, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
      <div className="p-6 text-white bg-black rounded-lg w-80">
        <div className="text-center">
          <h3 className="mb-4 text-lg font-semibold">Are you sure you want to delete this Order?</h3>
        </div>
        <div className="flex justify-around mt-6 gap-3">
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            type="button"
            className="px-6 py-2 text-sm font-medium bg-orange-500 text-black rounded-xl hover:bg-orange-600"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
