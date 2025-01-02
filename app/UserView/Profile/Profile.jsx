"use client";
import React from "react";
import Link from "next/link";
import { Pencil, User2Icon } from "lucide-react";

export default function Profile() {
  return (
    <div className="w-full max-w-3xl p-8 mx-auto bg-white rounded-xl">
      {/* Profile Icon */}
      <div className="relative flex items-center justify-center w-24 h-24 mx-auto text-orange-600 bg-orange-100 rounded-full">
        <User2Icon className="text-3xl font-bold" />
      </div>

      {/* Example Labels */}
      <label className="block text-sm text-black">Hello</label>

      {/* Information Sections */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <label className="block text-sm text-black">Hello</label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm text-black">Hello</label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm text-black">Hello</label>
      </div>

      {/* Edit Button */}
      <div className="flex items-start mt-6 space-x-6">
        <Link
          href="/UserView/Profile/Edit"
          className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-400 focus:outline-none"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
