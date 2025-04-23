"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSession } from "next-auth/react";


const AddCashierForm = () => {
  const [showPassword, setShowPassword] = useState(false);
   const { data: session } = useSession();
  const [cashier, setCashier] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nicNumber: "",
    password: "",
    confirmPassword: "",
    selectCanteen: session?.user?.canteenName
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
    <div className="bg-[#2B2623] p-8 rounded-md shadow-lg w-full max-w-xl mx-auto">
  <form onSubmit={handleSubmit} className="space-y-4 text-white">
    {/* Name Fields */}
    <div className="flex gap-2 mt-6">
      <div className="flex-1">
        <label className="block text-sm text-orange-500">First Name</label>
        <input
          type="text"
          name="firstName"
          value={cashier.firstName}
          onChange={handleInputChange}
          className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm text-orange-500">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={cashier.lastName}
          onChange={handleInputChange}
          className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
        />
      </div>
    </div>

    {/* Email */}
    <div>
      <label className="block text-sm text-orange-500">Email</label>
      <input
        type="email"
        name="email"
        value={cashier.email}
        onChange={handleInputChange}
        className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
      />
    </div>

    {/* Phone & NIC */}
    <div className="flex gap-2">
      <div className="flex-1">
        <label className="block text-sm text-orange-500">Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          value={cashier.phoneNumber}
          onChange={handleInputChange}
          className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm text-orange-500">NIC Number</label>
        <input
          type="text"
          name="nicNumber"
          value={cashier.nicNumber}
          onChange={handleInputChange}
          className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
        />
      </div>
    </div>

    {/* Password Fields */}
    {["password", "confirmPassword"].map((field) => (
      <div key={field} className="relative">
        <label className="block text-sm text-orange-500">
          {field === "password" ? "Password" : "Confirm Password"}
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name={field}
          value={cashier[field]}
          onChange={handleInputChange}
          className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
        />
        <span
          className="absolute inset-y-0 flex items-center text-gray-600 text-sm right-3 top-4 hover:text-orange-500 focus:outline-none"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>
    ))}

    {/* Image Upload */}
    <div>
      <label className="block text-sm text-orange-500">Image</label>
      <input
        type="file"
        onChange={handleFileChange}
        className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-[#3B3737] file:text-white hover:file:bg-orange-500"
      />
      {localPreview && (
        <div className="mt-4">
          <p className="mb-2 text-sm text-gray-400">Preview:</p>
          <img src={localPreview} alt="Preview" className="w-full rounded-lg shadow" />
        </div>
      )}
    </div>

    {/* Buttons */}
    <div className="flex justify-end mt-6 space-x-4">
      <button
        type="button"
        className="px-4 py-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
        onClick={resetForm}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
      >
        Add
      </button>
    </div>
  </form>
</div>

  );
};

export default AddCashierForm;
