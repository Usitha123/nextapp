"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ChangePassword from "./Edit/ChangePassword";
import { UserRound } from "lucide-react";

export default function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [owners, setOwners] = useState([]);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [targetStudent, setTargetStudent] = useState(null);

  const fetchOwners = useCallback(async () => {
    try {
      const res = await fetch("/api/viewownerDetails");
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
    <div className="bg-[#2B2623] p-8 rounded-xl shadow-lg w-full max-w-md mx-auto">

  {/* Profile Icon */}
  <div className="relative flex items-center justify-center w-24 h-24 mx-auto text-orange-600 bg-orange-100 rounded-full">
    <span className="text-3xl"><UserRound/></span>
    
  </div>

  {/* Profile Info */}
  <div className="text-sm space-y-4 mt-6">
    <div className="grid grid-cols-2 gap-4">
      <label className="text-orange-500">First Name</label>
      <span className="text-right text-gray-200">{targetStudent.firstName || "N/A"}</span>
    </div>
    <hr className=" border-gray-500" />
    <div className="grid grid-cols-2 gap-4">
      <label className="text-orange-500">Last Name</label>
      <span className="text-right text-gray-200">{targetStudent.lastName || "N/A"}</span>
    </div>
    <hr className=" border-gray-500" />
    <div className="grid grid-cols-2 gap-4">
      <label className="text-orange-500">Phone</label>
      <span className="text-right text-gray-200">{targetStudent.phoneNumber || "N/A"}</span>
    </div>
    <hr className=" border-gray-500"/>
    <div className="grid grid-cols-2 gap-4">
      <label className="text-orange-500 ">Email</label>
      <span className="text-right text-gray-200">{targetStudent.email || "N/A"}</span>
    </div>
    <hr className=" border-gray-500"/>
    <div className="grid grid-cols-2 gap-4">
      <label className="text-orange-500">NIC Number</label>
      <span className="text-right text-gray-200">{targetStudent.nicNumber || "N/A"}</span>
    </div>

    {/* Edit Button */}
    <div className="flex">
      <Link
        href={`/Canteendashboard/Profile/Edit`}
        className="px-4 py-2 mx-auto text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
      >
        Edit
      </Link>
    </div>
  </div>

      {/* Change Password Modal */}
      <ChangePassword
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
