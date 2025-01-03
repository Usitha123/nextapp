// Profile.js
"use client"
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ChangePassword from "./ChangePassword";

export default function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [owners, setOwners] = useState([]);
  const { data: session } = useSession();
   const [loading, setLoading] = useState(true);
    const [targetStudent, setTargetStudent] = useState(null);

  useEffect(() => {
      const fetchOwners = async () => {
        try {
          const res = await fetch("/api/allcashierlist");
          if (!res.ok) {
            throw new Error("Failed to fetch Owners");
          }
          const data = await res.json();
          setOwners(data);
  
          // Find the student with the specific email
          const student = data.find((s) => s.email === session?.user?.email);
          setTargetStudent(student || null);
        } catch (error) {
          console.error("Error fetching Owners:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchOwners();
    }, [session?.user?.email]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (!targetStudent) {
      return <div>No student found with the current users email.</div>;
    }

  return (
    <div className="bg-[#1b1b1b] p-6 rounded-md shadow-lg w-full max-w-xl mx-auto">
      <h2 className="mb-6 text-2xl font-semibold text-white">Profile</h2>
      <div className="flex items-start space-x-6">
        {/* Profile Picture */}
        <div className="relative flex items-center justify-center w-24 h-24 text-white bg-gray-700 rounded-full">
          {/* Placeholder Profile Icon */}
          <span className="text-3xl">👤</span>
          <button className="absolute bottom-0 right-0 p-1 text-xs text-white bg-orange-500 rounded-full">
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
                value={targetStudent.firstName}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Last Name</label>
              <input
                type="text"
                className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Last Name"
                value={targetStudent.lastName}
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
                value={targetStudent.phoneNumber}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Email</label>
              <input
                type="email"
                className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Email"
                value={targetStudent.email}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400">NIC Number</label>
            <input
              type="text"
              className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="NIC Number"
              value={targetStudent.nicNumber}
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400">Password</label>
            <input
              type="text"
              className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Password"
             // value={targetStudent.nicNumber}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400">Confirm Password</label>
            <input
              type="text"
              className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Confirm Password"
             // value={targetStudent.nicNumber}
            />
          </div>

         

          {/* Action Buttons */}
          <div className="flex justify-end mt-6 space-x-4">
            <Link
              href="/Cashierdashboard"
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none"
            >
              Cancel
            </Link>
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
