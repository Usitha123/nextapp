// Deletecanteens.js
import React from 'react';

const Deletecanteens = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="w-1/3 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-center">Are you sure you want to delete this canteen?</h2>
        <div className="flex justify-around">
          <button 
            onClick={onDelete}
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-400"
          >
            Yes, Delete
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Deletecanteens;
