"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ChangePassword from "./ChangePassword";
import { Pencil, User2Icon } from "lucide-react";

export default function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetStudent, setTargetStudent] = useState(null);

  // Fetch student data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/allstudentslist");
        if (!res.ok) throw new Error("Failed to fetch students");

        const data = await res.json();
        setStudents(data);

        // Find the student with the current users email
        const student = data.find((s) => s.email === session?.user?.email);
        setTargetStudent(student || null);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [session?.user?.email]);

  // Handle input field changes (if needed)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTargetStudent((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div>Loading...</div>;

  if (!targetStudent)
    return <div>No student found with the current users email.</div>;

  return (
    <div className="w-full max-w-3xl p-8 mx-auto bg-white rounded-xl">
      <div className="relative flex items-center justify-center w-24 h-24 mx-auto text-orange-600 bg-orange-100 rounded-full">
        <User2Icon className="text-3xl font-bold" />
        <button className="absolute bottom-0 right-0 p-1 text-white bg-orange-500 rounded-full">
          <Pencil className="p-1" />
        </button>
      </div>

      {/* Profile Form */}
      <form className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">First Name</label>
            <input
              className="w-full p-2 mt-1 text-black bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              type="text"
              placeholder="First Name"
              name="firstName"
              value={targetStudent.firstName || ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Last Name</label>
            <input
              className="w-full p-2 mt-1 text-black bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={targetStudent.lastName || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Phone</label>
            <input
              className="w-full p-2 mt-1 text-black bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              type="text"
              placeholder="Phone"
              name="phone"
              value={targetStudent.phoneNumber || ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              className="w-full p-2 mt-1 text-black bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              type="email"
              placeholder="Email"
              name="email"
              value={targetStudent.email || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label htmlFor="faculty-select" className="block text-sm text-gray-600">
            Faculty
          </label>
          <select
            id="faculty-select"
            name="faculty"
            value={targetStudent.faculty || ""}
            onChange={handleInputChange}
            required
            className="w-full p-2 mt-1 text-black bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select Faculty</option>
            <option value="Computing">Computing</option>
            <option value="Engineering">Engineering</option>
            <option value="Science">Science</option>
            <option value="Arts">Arts</option>
          </select>
        </div>

        <div className="mt-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-orange-500 hover:underline focus:outline-none"
          >
            Change Password
          </button>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <Link
            href="/UserView/Profile"
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

      <ChangePassword
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
