"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { User2Icon } from "lucide-react";

export default function Profile() {
  const { data: session } = useSession();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetStudent, setTargetStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/allstudentslist");
        if (!res.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await res.json();
        setStudents(data);

        // Find the student with the specific email
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

  

  if (!targetStudent) {
    return <div>No student found with the current users email.</div>;
  }

  return (
    <div className="w-full max-w-3xl p-8 mx-auto bg-white rounded-xl">
      {/* Profile Icon */}
      <div className="relative flex items-center justify-center w-24 h-24 mx-auto text-orange-600 bg-orange-100 rounded-full">
        <User2Icon className="text-3xl font-bold" />
      </div>

      {/* Information Sections */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <label className="block text-sm text-black">First Name:</label>
        <span>{targetStudent.firstName || "N/A"}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm text-black">Last Name:</label>
        <span>{targetStudent.lastName || "N/A"}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm text-black">Phone:</label>
        <span>{targetStudent.phoneNumber || "N/A"}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm text-black">Email:</label>
        <span>{targetStudent.email || "N/A"}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm text-black">Faculty:</label>
        <span>{targetStudent.faculty || "N/A"}</span>
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
