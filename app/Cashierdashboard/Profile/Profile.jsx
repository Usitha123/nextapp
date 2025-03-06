"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ChangePassword from "./Edit/ChangePassword";
import { Pencil, User2Icon } from "lucide-react";

export default function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [owners, setOwners] = useState([]);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [targetStudent, setTargetStudent] = useState(null);

  const fetchOwners = useCallback(async () => {
    try {
      const res = await fetch("/api/allcashierlist");
      if (!res.ok) {
        throw new Error("Failed to fetch Owners");
      }
      const data = await res.json();
      setOwners(data);

      const student = data.find((s) => s.email === session?.user?.email);
      setTargetStudent(student || null);
    } catch (error) {
      console.error("Error fetching Owners:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);


  if (!targetStudent) {
    return <div>No student found with the current users email.</div>;
  }

  return (
    <div className="bg-[#2B2623] p-8 rounded-md shadow-lg w-full max-w-xl mx-auto">
      {/* Profile Picture */}
      <div className="relative flex items-center justify-center w-24 h-24 mx-auto text-orange-600 bg-orange-100 rounded-full">
        <User2Icon className="text-3xl font-bold" />
      </div>
  
      {/* Profile Details */}
      
        <div className="space-y-4">
          <div className='flex gap-2 mt-6'>
            {/* First Name */}
            <div className='flex-1'>
              <label className="block text-sm text-orange-500">First Name</label>
              <div className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md">
                {targetStudent.firstName || 'N/A'}
              </div>
            </div>
  
            {/* Last Name */}
            <div className='flex-1'>
              <label className="block text-sm text-orange-500">Last Name</label>
              <div className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md">
                {targetStudent.lastName || 'N/A'}
              </div>
            </div>
          </div>
  
          {/* Phone */}
          <div>
            <label className="block text-sm text-orange-500">Phone</label>
            <div className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md">
              {targetStudent.phoneNumber || 'N/A'}
            </div>
          </div>
  
          {/* Email */}
          <div>
            <label className="block text-sm text-orange-500">Email</label>
            <div className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md">
              {targetStudent.email || 'N/A'}
            </div>
          </div>
  
          {/* NIC Number */}
          <div>
            <label className="block text-sm text-orange-500">NIC Number</label>
            <div className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md">
              {targetStudent.nicNumber || 'N/A'}
            </div>
          </div>
  
          {/* Action Buttons */}
          <div className="flex justify-end mt-6 space-x-4">
            <Link
              href="/Cashierdashboard/Profile/Edit"
              className="px-4 py-2 font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
            >
              Edit
            </Link>
          </div>
        </div>
    </div>
  );  
}
