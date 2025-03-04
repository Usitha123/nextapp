import React from "react";

const Deleteowners = ({ isOpen, onClose, onDelete, owner }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
      <div className="p-6 bg-black text-gray-300 rounded-lg shadow-lg">
        <h3 className="mb-6  font-semibold text-center">
          Are you sure you want to delete {owner ? owner.firstName : ''}?
        </h3>
        <div className="flex justify-around">
          <button 
            onClick={onDelete}
            className="px-6 py-2 text-sm font-medium bg-orange-500 text-black rounded-xl hover:bg-orange-600"
          >
            Yes
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Deleteowners;
