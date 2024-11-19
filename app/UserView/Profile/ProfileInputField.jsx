import React from "react";

export default function ProfileInputField({ label, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm text-gray-600">{label}</label>
      <input
        type={type}
        className="w-full p-2 mt-1 text-black bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );

}
