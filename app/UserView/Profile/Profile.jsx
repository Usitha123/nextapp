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
    <div className="w-full max-w-md p-8 mx-auto bg-white rounded-xl">
      {/* Profile Icon */}
      <div className="relative flex items-center justify-center w-24 h-24 mx-auto text-orange-600 bg-orange-100 rounded-full">
        <User2Icon className="text-3xl font-bold" />
      </div>

      <div className="text-sm space-y-4 m-4">
        {/* Information Sections */}
      <div className="grid grid-cols-2 gap-4">
        <label className="text-gray-600">First Name</label>
        <span className="text-right">{targetStudent.firstName || "N/A"}</span>
      </div>
      <hr/>
      <div className="grid grid-cols-2 gap-4">
        <label className="text-gray-600">Last Name</label>
        <span className="text-right">{targetStudent.lastName || "N/A"}</span>
      </div>
      <hr/>
      <div className="grid grid-cols-2 gap-4">
        <label className="text-gray-600">Phone</label>
        <span className="text-right">{targetStudent.phoneNumber || "N/A"}</span>
      </div>
      <hr/>
      <div className="grid grid-cols-2 gap-4">
        <label className="text-gray-600">Email</label>
        <span className="text-right">{targetStudent.email || "N/A"}</span>
      </div>
      <hr/>
      <div className="grid grid-cols-2 gap-4">
        <label className="text-gray-600">Faculty</label>
        <span className="text-right">{targetStudent.faculty || "N/A"}</span>
      </div>
      

      {/* Edit Button */}
      <div className="flex">
        <Link
          href={`/UserView/Profile/Edit?id=${targetStudent._id}`}
          className="font-bold mx-auto mt-4 px-6 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-400 focus:outline-none"
        >
          Edit
        </Link>
      </div>
      
       </div>
      
    </div>
  );
}
