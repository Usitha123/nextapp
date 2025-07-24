"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ChangePassword from "./ChangePassword";
import { UserRound } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Profile() {
  const { data: session } = useSession();
  const [owners, setOwners] = useState([]);
  const [targetStudent, setTargetStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await fetch("/api/viewownerDetails");
        if (!res.ok) throw new Error("Failed to fetch owners");

        const data = await res.json();
        setOwners(data);

        const student = data.find((s) => s.email === session?.user?.email);
        setTargetStudent(student || null);
      } catch (error) {
        console.error("Error fetching owners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, [session?.user?.email]);

  if (loading) return <div>Loading...</div>;
  if (!targetStudent) return <div>No student found with the current user's email.</div>;

  return (
    <div className="bg-[#2B2623] p-8 rounded-md shadow-lg w-full max-w-xl mx-auto">
      {/* Profile Picture */}
      <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 text-orange-500 bg-[#3B3737] rounded-full">
        <UserRound className="text-3xl font-bold" />
      </div>

      {/* Profile Form */}
      <form className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm text-orange-500">First Name</label>
            <input
              type="text"
              className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
              value={targetStudent.firstName}
              readOnly
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-orange-500">Last Name</label>
            <input
              type="text"
              className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
              value={targetStudent.lastName}
              readOnly
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm text-orange-500">Phone</label>
            <input
              type="text"
              className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
              value={targetStudent.phoneNumber}
              readOnly
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-orange-500">Email</label>
            <input
              type="email"
              className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
              value={targetStudent.email}
              readOnly
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-orange-500">NIC Number</label>
          <input
            type="text"
            className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
            value={targetStudent.nicNumber}
            readOnly
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-sm text-orange-500">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md pr-10"
            placeholder="Password"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute text-gray-400 cursor-pointer top-8 right-3"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-sm text-orange-500">Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md pr-10"
            placeholder="Confirm Password"
          />
          <span
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute text-gray-400 cursor-pointer top-8 right-3"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <Link
            href="/Canteendashboard/Profile"
            className="px-4 py-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white transition bg-orange-500 rounded-xl hover:bg-orange-600"
          >
            Save
          </button>
        </div>
      </form>

      {/* Change Password Modal */}
      <ChangePassword isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
