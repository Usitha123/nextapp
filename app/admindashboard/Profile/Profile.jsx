"use client";

import React, { useState } from "react";
import ChangePassword from "./ChangePassword";

export default function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-[#1b1b1b] p-6 rounded-md shadow-lg w-full max-w-xl mx-auto">
      <h2 className="mb-6 text-2xl font-semibold text-white">Profile</h2>
      <div className="flex items-start space-x-6">
        {/* Profile Picture */}
        <div className="relative flex items-center justify-center w-24 h-24 text-white bg-gray-700 rounded-full">
          {/* Placeholder Profile Icon */}
          <span className="text-3xl">👤</span>
          <button
            className="absolute bottom-0 right-0 p-1 text-xs text-white bg-orange-500 rounded-full"
            onClick={() => console.log("Edit profile picture clicked")}
          >
            Edit
          </button>
        </div>

        {/* Profile Form */}
        <form className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400">First Name</label>
              <input
                type="text"
                className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Last Name</label>
              <input
                type="text"
                className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400">Phone</label>
              <input
                type="text"
                className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Phone"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Email</label>
              <input
                type="email"
                className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400">NIC Number</label>
            <input
              type="text"
              className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="NIC Number"
            />
          </div>

          <div className="mt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-orange-500 hover:underline focus:outline-none"
            >
              Change Password
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-400 focus:outline-none"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => console.log("Cancel action clicked")}
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Modal */}
      <ChangePassword
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
