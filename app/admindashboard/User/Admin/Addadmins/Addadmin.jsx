"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const AddCashierForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [admin, setAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nicNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const { firstName, lastName, email, password, confirmPassword } = admin;
    return (
      firstName &&
      lastName &&
      email &&
      password &&
      confirmPassword &&
      password === confirmPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Please fill out all fields correctly.");
      return;
    }

    try {
      const response = await fetch("/api/createadmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          status: "Active",
          phoneNumber: admin.phoneNumber,
          nicNumber: admin.nicNumber,
          password: admin.password,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to add admin.");
      }

      alert("Admin added successfully!");
      resetForm();
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  const resetForm = () => {
    setAdmin({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      nicNumber: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="w-full md:max-w-3xl p-6 mx-auto text-gray-400 bg-[#2B2623] rounded-md">
      <form onSubmit={handleSubmit}>
        {/* Name Fields */}
        <div className="flex mb-4 space-x-4">
          {["firstName", "lastName"].map((field) => (
            <div key={field} className="flex-1">
              <label className="p-1 text-sm text-orange-500">
                {field === "firstName" ? "First Name" : "Last Name"}
              </label>
              <input
                type="text"
                name={field}
                value={admin[field]}
                onChange={handleInputChange}
                className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
              />
            </div>
          ))}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="p-1 text-sm text-orange-500">Email</label>
          <input
            type="email"
            name="email"
            value={admin.email}
            onChange={handleInputChange}
            className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
          />
        </div>

        {/* Phone & NIC Fields */}
        <div className="flex mb-4 space-x-4">
          <div className="flex-1">
            <label className="p-1 text-sm text-orange-500">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={admin.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
            />
          </div>
          <div className="flex-1">
            <label className="p-1 text-sm text-orange-500">NIC Number</label>
            <input
              type="text"
              name="nicNumber"
              value={admin.nicNumber}
              onChange={handleInputChange}
              className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
            />
          </div>
        </div>

        {/* Password Fields */}
        {["password", "confirmPassword"].map((field) => (
          <div key={field} className="relative mb-4">
            <label className="p-1 text-sm text-orange-500">
              {field === "password" ? "Password" : "Confirm Password"}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name={field}
              value={admin[field]}
              onChange={handleInputChange}
              className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
            />
            <span
              className="absolute flex items-center text-gray-400 cursor-pointer right-3 bottom-2"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </span>
          </div>
        ))}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admindashboard/User/Admin"
            className="px-2 py-1 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
            onClick={resetForm}
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-black transition bg-orange-500 border border-orange-500 rounded-xl hover:bg-orange-600"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCashierForm;
