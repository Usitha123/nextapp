"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ChangePassword from "./ChangePassword";
import { Pencil, User2Icon } from "lucide-react";

export default function Profile() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetStudent, setTargetStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch("/api/allstudentslist");
        if (!res.ok) throw new Error("Failed to fetch students");

        const data = await res.json();
        setStudents(data);

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

  const handleInputChange = ({ target: { name, value } }) => {
    setTargetStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/updateuser?id=${targetStudent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(targetStudent),
      });

      if (!response.ok) throw new Error(await response.text());

      const updatedStudent = await response.json();
      console.log("Student updated:", updatedStudent);
      window.location.href = '/UserView/Profile';
    } catch (err) {
      console.error("Error updating student:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-3xl p-8 mx-auto bg-white rounded-xl">
        <p className="text-center">Loading profile...</p>
      </div>
    );
  }

  if (!targetStudent) {
    return (
      <div className="w-full max-w-3xl p-8 mx-auto bg-white rounded-xl">
        <p className="text-center">No student profile found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl p-8 mx-auto bg-white rounded-xl">
      <div className="relative flex items-center justify-center w-24 h-24 mx-auto text-orange-600 bg-orange-100 rounded-full">
        <User2Icon className="text-3xl font-bold" />
        <button
          className="absolute bottom-0 right-0 p-1 text-white bg-orange-500 rounded-full"
          onClick={() => setIsModalOpen(true)}
        >
          <Pencil className="p-1" />
        </button>
      </div>

      <form className="mt-8 space-y-4" onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="First Name"
            name="firstName"
            value={targetStudent?.firstName}
            onChange={handleInputChange}
            required
          />
          <InputField
            label="Last Name"
            name="lastName"
            value={targetStudent?.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Phone"
            name="phone"
            value={targetStudent?.phoneNumber}
            onChange={handleInputChange}
            required
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={targetStudent?.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Faculty"
            name="faculty"
            value={targetStudent?.faculty}
            onChange={handleInputChange}
            options={["Computing", "Engineering", "Science", "Arts"]}
            required
          />
        </div>

        <PasswordField
          label="Password"
          name="password"
          onChange={handleInputChange}
          required
        />
        <PasswordField
          label="Confirm Password"
          name="confirmpassword"
          onChange={handleInputChange}
          required
        />

        <div className="flex justify-end mt-6 space-x-4">
          <Link href="/UserView/Profile" className="button">
            Cancel
          </Link>
          <button type="submit" className="bg-orange-500 button">
            Save
          </button>
        </div>
      </form>

      <ChangePassword isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

const InputField = ({ label, name, value, onChange, type = "text", required }) => (
  <div>
    <label className="block text-sm text-gray-600">{label}</label>
    <input
      className="w-full p-2 mt-1 text-black bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={label}
      required={required}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required }) => (
  <div>
    <label className="block text-sm text-gray-600">{label}</label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full p-2 mt-1 text-black bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      required={required}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const PasswordField = ({ label, name, onChange, required }) => (
  <div>
    <label className="block text-sm text-gray-600">{label}</label>
    <input
      className="w-full p-2 mt-1 text-black bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      type="password"
      name={name}
      onChange={onChange}
      placeholder={label}
      required={required}
    />
  </div>
);
