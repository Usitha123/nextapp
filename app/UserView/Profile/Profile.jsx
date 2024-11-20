"use client";
import React, { useState } from "react";
import ChangePassword from "./ChangePassword";
import ProfileInputField from "./ProfileInputField";
import { Pencil, User2Icon } from "lucide-react";

export default function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full max-w-3xl p-8 mx-auto bg-white rounded-xl">
      <div className="relative flex items-center justify-center w-24 h-24 mx-auto text-orange-600 bg-orange-100 rounded-full">
        {/* Placeholder Profile Icon */}
        <span className="text-3xl">
          <User2Icon className="font-bold" />
        </span>
        <button className="absolute bottom-0 right-0 p-1 text-white bg-orange-500 rounded-full">
          <Pencil className="p-1" />
        </button>
      </div>

      <div className="flex items-start space-x-6">
        {/* Profile Form */}
        <form className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4 mt-8">
            <ProfileInputField label="First Name" placeholder="First Name" />
            <ProfileInputField label="Last Name" placeholder="Last Name" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ProfileInputField label="Phone" placeholder="Phone" />
            <ProfileInputField label="Email" type="email" placeholder="Email" />
          </div>

          <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm text-gray-600">Faculty</label>
  <select
    id="faculty-select" // Match the id with the label's htmlFor
    required
    className="w-full p-2 mt-1 text-black bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
  >
    <option value="">Select Faculty</option>
    <option value="Computing">Computing</option>
    <option value="Engineering">Engineering</option>
    <option value="Science">Science</option>
    <option value="Arts">Arts</option>
    {/* Add more faculties as needed */}
  </select>
</div>



          {/* Change Password */}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-orange-500 hover:underline focus:outline-none"
            >
              Change Password
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-400 focus:outline-none"
            >
              Save
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
