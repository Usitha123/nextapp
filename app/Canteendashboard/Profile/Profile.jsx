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
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-auto">

  {/* Profile Icon */}
  <div className="relative flex items-center justify-center w-24 h-24 mx-auto text-orange-600 bg-orange-100 rounded-full">
    <span className="text-3xl"><UserRound/></span>
    
  </div>

  {/* Profile Info */}
  <div className="text-sm space-y-4 mt-6">
    <div className="grid grid-cols-2 gap-4">
      <label className="text-gray-600">First Name</label>
      <span className="text-right">{targetStudent.firstName || "N/A"}</span>
    </div>
    <hr />
    <div className="grid grid-cols-2 gap-4">
      <label className="text-gray-600">Last Name</label>
      <span className="text-right">{targetStudent.lastName || "N/A"}</span>
    </div>
    <hr />
    <div className="grid grid-cols-2 gap-4">
      <label className="text-gray-600">Phone</label>
      <span className="text-right">{targetStudent.phoneNumber || "N/A"}</span>
    </div>
    <hr />
    <div className="grid grid-cols-2 gap-4">
      <label className="text-gray-600">Email</label>
      <span className="text-right">{targetStudent.email || "N/A"}</span>
    </div>
    <hr />
    <div className="grid grid-cols-2 gap-4">
      <label className="text-gray-600">NIC Number</label>
      <span className="text-right">{targetStudent.nicNumber || "N/A"}</span>
    </div>

    {/* Edit Button */}
    <div className="flex">
      <Link
        href={`/Canteendashboard/Profile/Edit`}
        className="font-bold mx-auto mt-4 px-6 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-400 focus:outline-none"
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
