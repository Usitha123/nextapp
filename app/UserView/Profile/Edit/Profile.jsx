"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ChangePassword from "./ChangePassword";
import { Pencil, User2Icon } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Profile() {
  const { data: session } = useSession();

  const [targetStudent, setTargetStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch("/api/allstudentslist");
        if (!res.ok) throw new Error("Failed to fetch students");

        const data = await res.json();
        const student = data.find((s) => s.email === session.user.email);
        setTargetStudent(student || null);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [session?.user?.email]);

  const handleInputChange = ({ target: { name, value } }) => {
    setTargetStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const updatedData = { ...targetStudent, password };
      const res = await fetch(`/api/updateuser?id=${targetStudent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error(await res.text());

      const updatedStudent = await res.json();
      console.log("Student updated:", updatedStudent);
      window.location.href = "/UserView/Profile";
    } catch (err) {
      console.error("Error updating student:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <p className="text-center">Loading profile...</p>
      </Container>
    );
  }

  if (!targetStudent) {
    return (
      <Container>
        <p className="text-center">No student profile found</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="relative flex items-center justify-center w-24 h-24 mx-auto text-orange-600 bg-orange-100 rounded-full">
        <User2Icon className="text-3xl font-bold" />
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-0 right-0 p-1 text-white bg-orange-500 rounded-full"
        >
          <Pencil className="p-1" />
        </button>
      </div>

      <form className="mt-8 space-y-4" onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="First Name"
            name="firstName"
            value={targetStudent.firstName}
            onChange={handleInputChange}
            required
          />
          <InputField
            label="Last Name"
            name="lastName"
            value={targetStudent.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <InputField
          label="Email"
          name="email"
          type="email"
          value={targetStudent.email}
          onChange={handleInputChange}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Phone"
            name="phoneNumber"
            value={targetStudent.phoneNumber}
            onChange={handleInputChange}
            required
          />
          <SelectField
            label="Faculty"
            name="faculty"
            value={targetStudent.faculty}
            onChange={handleInputChange}
            options={["Computing", "Engineering", "Science", "Arts"]}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <PasswordField
            label="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            show={showPassword}
            toggleShow={() => setShowPassword((prev) => !prev)}
          />
          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            show={showPassword}
            toggleShow={() => setShowPassword((prev) => !prev)}
          />
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <Link href="/UserView/Profile" className="px-3 py-2 text-white bg-black rounded-xl">
            Cancel
          </Link>
          <button type="submit" className="px-3 py-2 text-white bg-orange-500 rounded-xl">
            Save
          </button>
        </div>
      </form>

      <ChangePassword isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Container>
  );
}

const Container = ({ children }) => (
  <div className="w-full max-w-3xl p-6 mx-auto bg-white rounded-xl">
    {children}
  </div>
);

const InputField = ({ label, name, value, onChange, type = "text", required }) => (
  <div>
    <label className="block text-sm text-gray-600">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={label}
      required={required}
      className="w-full p-2 mt-1 text-black bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required }) => (
  <div>
    <label className="block text-sm text-gray-600">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-2 mt-1 text-black bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const PasswordField = ({ label, name, value, onChange, show, toggleShow }) => (
  <div>
    <label className="block text-sm text-gray-600">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        required
        className="w-full p-2 mt-1 text-black bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <span
        onClick={toggleShow}
        className="absolute text-gray-600 cursor-pointer top-3 right-3"
      >
        {show ? <FaEye /> : <FaEyeSlash />}
      </span>
    </div>
  </div>
);
