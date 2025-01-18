"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AddCashierForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [cashier, setCashier] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nicNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);

  // Update cashier input field
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCashier((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input for image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setLocalPreview(URL.createObjectURL(file));
    }
  };

  // Validate form fields
  const isFormValid = () => {
    const { firstName, lastName, email, password, confirmPassword } = cashier;
    return (
      firstName && lastName && email && password && confirmPassword &&
      password === confirmPassword && imageFile
    );
  };

  // Upload image to Cloudinary
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my-uploads");

    const response = await fetch("https://api.cloudinary.com/v1_1/dtvsl05hw/image/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Image upload failed.");

    const { secure_url } = await response.json();
    return secure_url;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Please fill out all fields correctly.");
      return;
    }

    try {
      const uploadedImageURL = await uploadImage(imageFile);
      const cashierData = { ...cashier, image: uploadedImageURL };

      const response = await fetch("/api/addcashier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cashierData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to add cashier.");
      }

      alert("Cashier added successfully!");
      resetForm();
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  // Reset the form
  const resetForm = () => {
    setCashier({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      nicNumber: "",
      password: "",
      confirmPassword: "",
    });
    setImageFile(null);
    setLocalPreview(null);
  };

  return (
    <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
      {/* <h2 className="mb-6 text-2xl font-bold">Add Cashier</h2> */}
      <form onSubmit={handleSubmit}>
        {/* Input Fields */}
{/* Name Fields in the Same Row */}
<div className="mb-4 flex space-x-4">
  <div className="flex-1">
    <label className="block mb-1 text-sm font-medium">First Name</label>
    <input
      type="text"
      name="firstName"
      value={cashier.firstName}
      onChange={handleInputChange}
      className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring focus:ring-orange-500"
    />
  </div>
  <div className="flex-1">
    <label className="block mb-1 text-sm font-medium">Last Name</label>
    <input
      type="text"
      name="lastName"
      value={cashier.lastName}
      onChange={handleInputChange}
      className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring focus:ring-orange-500"
    />
  </div>
</div>

        {[ "email"].map((field) => (
          <div key={field} className="mb-4">
            <label className="block mb-1 text-sm font-medium">
              {field.replace(/([A-Z])/g, " $1").toUpperCase()}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              value={cashier[field]}
              onChange={handleInputChange}
              className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring focus:ring-orange-500"
            />
          </div>
        ))}
        <div className="mb-4 flex space-x-4">
  <div className="flex-1">
    <label className="block mb-1 text-sm font-medium">Phone Number</label>
    <input
      type="text"
      name="phoneNumber"
      value={cashier.phoneNumber}
      onChange={handleInputChange}
      className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring focus:ring-orange-500"
    />
  </div>
  <div className="flex-1">
    <label className="block mb-1 text-sm font-medium">NIC Number</label>
    <input
      type="text"
      name="nicNumber"
      value={cashier.nicNumber}
      onChange={handleInputChange}
      className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring focus:ring-orange-500"
    />
  </div>
</div>


        {/* Password Fields */}
        {["password", "confirmPassword"].map((field) => (
          <div key={field} className="relative mb-4">
            <label className="block mb-1 text-sm font-medium">
              {field === "password" ? "Password" : "Confirm Password"}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name={field}
              value={cashier[field]}
              onChange={handleInputChange}
              className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring focus:ring-orange-500"
            />
            <span
              className="absolute inset-y-0 flex items-center text-gray-400 cursor-pointer right-3"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        ))}

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-gray-700 file:text-white hover:file:bg-orange-500"
          />
          {localPreview && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-gray-400">Preview:</p>
              <img src={localPreview} alt="Preview" className="w-full rounded-lg shadow" />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
            onClick={resetForm}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCashierForm;
