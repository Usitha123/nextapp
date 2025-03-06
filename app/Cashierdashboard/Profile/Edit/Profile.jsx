// Profile.js
"use client"
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ChangePassword from "./ChangePassword";
import { User2Icon } from "lucide-react";

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
      <div className="bg-[#2B2623] p-8 rounded-md shadow-lg w-full max-w-xl mx-auto">
     
          {/* Profile Picture */}
          <div className="mb-4 relative flex items-center justify-center w-24 h-24 mx-auto text-orange-600 bg-orange-100 rounded-full">
            <User2Icon className="text-3xl font-bold" />
          </div>
    
          {/* Profile Form */}
          <form className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-orange-500">First Name</label>
                <div className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md">
                  {targetStudent.firstName || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm text-orange-500">Last Name</label>
                <div className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md">
                  {targetStudent.lastName || 'N/A'}
                </div>
              </div>
            </div>
    
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-orange-500">Phone</label>
                <div className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md">
                  {targetStudent.phoneNumber || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm text-orange-500">Email</label>
                <div className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md">
                  {targetStudent.email || 'N/A'}
                </div>
              </div>
            </div>
    
            <div>
              <label className="block text-sm text-orange-500">NIC Number</label>
              <div className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md">
                {targetStudent.nicNumber || 'N/A'}
              </div>
            </div>
    
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-orange-500">Password</label>
                <input
                  type="password"
                  className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Password"
                />
              </div>
              <div>
                <label className="block text-sm text-orange-500">Confirm Password</label>
                <input
                  type="password"
                  className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
    
            {/* Action Buttons */}
            <div className="flex justify-end mt-6 space-x-4">
              <Link
                href="/Cashierdashboard/Profile"
                className="px-4 py-1 m-2 text-orange-500 border border-orange-500 rounded-xl bg-[#3B3737] hover:bg-black transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-1 m-2 text-white bg-orange-500 rounded-xl hover:bg-orange-400 transition"
              >
                Save
              </button>
            </div>
          </form>
      
    
        {/* Change Password Modal */}
        <ChangePassword
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    );
    
}
