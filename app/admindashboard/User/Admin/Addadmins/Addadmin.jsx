"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const AddAdminForm = () => {
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
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const validateForm = () => {
    const newErrors = {};
    const { firstName, lastName, email, phoneNumber, nicNumber, password, confirmPassword } = admin;

    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!email) newErrors.email = "Email is required";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(phoneNumber)) newErrors.phoneNumber = "Phone number must be 10 digits";
    if (!nicNumber) newErrors.nicNumber = "NIC is required";
    else if (!/^\d{12}$/.test(nicNumber)) newErrors.nicNumber = "NIC must be 12 digits";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    if (password && confirmPassword && password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/addadmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          phone: admin.phoneNumber, // match backend
          nic: admin.nicNumber,     // match backend
          password: admin.password,
        }),
      });

      if (!response.ok) {
        const result = await response.text();
        throw new Error(result || "Failed to add admin.");
      }

      alert("Admin added successfully!");
      resetForm();
    } catch (error) {
      console.error("Form submission error:", error);
      alert(error.message || "An error occurred while submitting the form.");
    } finally {
      setSubmitting(false);
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
    setErrors({});
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
                className={`w-full p-2 rounded-md bg-[#3B3737] text-gray-300 ${
                  errors[field] ? "border border-red-500" : ""
                }`}
              />
              {errors[field] && <p className="mt-1 text-sm text-red-500">{errors[field]}</p>}
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
            className={`w-full p-2 rounded-md bg-[#3B3737] text-gray-300 ${errors.email ? "border border-red-500" : ""}`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
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
              className={`w-full p-2 rounded-md bg-[#3B3737] text-gray-300 ${errors.phoneNumber ? "border border-red-500" : ""}`}
            />
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
          </div>
          <div className="flex-1">
            <label className="p-1 text-sm text-orange-500">NIC Number</label>
            <input
              type="text"
              name="nicNumber"
              value={admin.nicNumber}
              onChange={handleInputChange}
              className={`w-full p-2 rounded-md bg-[#3B3737] text-gray-300 ${errors.nicNumber ? "border border-red-500" : ""}`}
            />
            {errors.nicNumber && <p className="mt-1 text-sm text-red-500">{errors.nicNumber}</p>}
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
              className={`w-full p-2 rounded-md bg-[#3B3737] text-gray-300 ${errors[field] ? "border border-red-500" : ""}`}
            />
            <span
              className="absolute flex items-center text-gray-400 cursor-pointer right-3 bottom-2"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </span>
            {errors[field] && <p className="mt-1 text-sm text-red-500">{errors[field]}</p>}
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
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-black transition bg-orange-500 border border-orange-500 rounded-xl hover:bg-orange-600 disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAdminForm;
