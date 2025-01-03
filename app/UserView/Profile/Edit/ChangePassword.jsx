import React, { useState } from "react";

const UpdateStatusModal = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState("active");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
      {/* Overlay */}
      <div
        className="absolute inset-0"
        onClick={onClose} // Close the modal when clicking outside
      ></div>
      
      {/* Modal with blur effect */}
      <div className="relative text-gray-800 bg-white rounded-lg w-80">
        <div className="">
          <h3 className=" p-2 rounded-t-xl text-center bg-orange-500 text-white  text-lg ">Change Password</h3>
          <div className=" p-6 flex flex-col items-start space-y-3">
            <div className="w-full">
              <label className="block text-md ">New Password</label>
              <input
                type="password"
                className="w-full p-2 mt-1 mb-2  bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter Password"
              />
            </div>
            <div className="w-full" >
              <label className="block text-md ">Confirm Password</label>
              <input
                type="password"
                className="w-full p-2 mt-1  bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div className="flex p-4 pb-6 justify-center space-x-4">
            
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 text-orange-500 border-2 border-orange-400 rounded-3xl hover:bg-orange-200 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-orange-500 rounded-3xl hover:bg-orange-600 focus:outline-none"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
