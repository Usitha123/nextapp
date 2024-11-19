"use client";
import React, { useState } from "react";
import ChangePassword from "./ChangePassword";
import ProfileInputField from "./ProfileInputField";
import { Pencil, User2Icon } from "lucide-react";

export default function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white p-8 rounded-xl w-full max-w-3xl mx-auto">
      <div className="relative mx-auto flex items-center justify-center w-24 h-24 text-3xl text-gray-500 bg-gray-100 rounded-full">
        {/* Placeholder Profile Icon */}
        <span className="text-3xl">
          <User2Icon />
        </span>
        <button className="absolute bottom-0 right-0 p-1 text-xs text-white bg-orange-500 rounded-full">
          <Pencil className="p-1" />
        </button>
      </div>

      <div className="flex items-start space-x-6">
        {/* Profile Form */}
        <form className="flex-1 space-y-4">
          <div className="mt-8 grid grid-cols-2 gap-4">
            <ProfileInputField label="First Name" placeholder="First Name" />
            <ProfileInputField label="Last Name" placeholder="Last Name" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ProfileInputField label="Phone" placeholder="Phone" />
            <ProfileInputField label="Email" type="email" placeholder="Email" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ProfileInputField label="NIC Number" />
            <ProfileInputField label="Faculty"  />
          </div>


          {/* Change Password */}
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
