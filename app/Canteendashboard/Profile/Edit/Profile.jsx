// Profile.js
"use client"
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ChangePassword from "./ChangePassword";
import { UserRound } from "lucide-react";

export default function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [owners, setOwners] = useState([]);
  const { data: session } = useSession();
   const [loading, setLoading] = useState(true);
    const [targetStudent, setTargetStudent] = useState(null);

  useEffect(() => {
      const fetchOwners = async () => {
        try {
          const res = await fetch("/api/viewownerDetails");
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
      <div className="bg-[#2B2623] p-8 rounded-md shadow-lg w-full max-w-xl mx-auto">
        {/* Profile Picture */}
        <div className="relative flex items-center mx-auto mb-4 justify-center w-24 h-24 text-orange-500 bg-[#3B3737] rounded-full">
            <span className="text-3xl"><UserRound className="text-3xl font-bold "/></span>
            
          </div>
        <div className="flex items-start space-x-6">
          
          
    
          {/* Profile Form */}
          <form className="flex-1 space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm text-orange-500">First Name</label>
                <input
                  type="text"
                  className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
                  placeholder="First Name"
                  value={targetStudent.firstName}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-orange-500">Last Name</label>
                <input
                  type="text"
                  className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
                  placeholder="Last Name"
                  value={targetStudent.lastName}
                />
              </div>
            </div>
    
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm text-orange-500">Phone</label>
                <input
                  type="text"
                  className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
                  placeholder="Phone"
                  value={targetStudent.phoneNumber}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-orange-500">Email</label>
                <input
                  type="email"
                  className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
                  placeholder="Email"
                  value={targetStudent.email}
                />
              </div>
            </div>
    
            <div>
              <label className="block text-sm text-orange-500">NIC Number</label>
              <input
                type="text"
                className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
                placeholder="NIC Number"
                value={targetStudent.nicNumber}
              />
            </div>
    
            <div>
              <label className="block text-sm text-orange-500">Password</label>
              <input
                type="text"
                className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
                placeholder="Password"
              />
            </div>
    
            <div>
              <label className="block text-sm text-orange-500">Confirm Password</label>
              <input
                type="text"
                className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
                placeholder="Confirm Password"
              />
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
                className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
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
