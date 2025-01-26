"use client";
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AddCashierForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [owner, setOwner] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nicNumber: "",
    password: "",
    confirmPassword: "",
    selectcanteen: "",
  });
  const [canteens, setCanteens] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCanteens();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOwner((prev) => ({ ...prev, [name]: value }));
  };

  const fetchCanteens = async () => {
    try {
      const res = await fetch("/api/allcanteenslist");
      if (!res.ok) throw new Error("Failed to fetch canteens");
      const data = await res.json();
      const inactiveCanteens = data.filter((canteen) => canteen.ownerstatus === "Inactive");
      setCanteens(inactiveCanteens);
    } catch (err) {
      setError("Failed to load canteens.");
    }
  };

  const isFormValid = () => {
    const { firstName, lastName, email, password, confirmPassword, selectcanteen } = owner;
    return (
      firstName &&
      lastName &&
      email &&
      password &&
      confirmPassword &&
      password === confirmPassword &&
      selectcanteen
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      alert("Please fill out all fields correctly.");
      return;
    }

    try {
      // Find the selected canteen's ID
      const selectedCanteen = canteens.find(
        (canteen) => canteen.canteenName === owner.selectcanteen
      );

      if (!selectedCanteen) {
        alert("Please select a valid canteen.");
        return;
      }

      const response = await fetch("/api/addowner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: owner.firstName,
          lastName: owner.lastName,
          email: owner.email,
          status: "Active",
          phoneNumber: owner.phoneNumber,
          nicNumber: owner.nicNumber,
          selectcanteen: selectedCanteen.canteenName, // Pass the actual canteen ID
          password: owner.password,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to add owner.");
      }

      alert("Owner added successfully!");
      
      // Pass the selected canteen's ID to updateOwnerStatus
      await updateOwnerStatus(selectedCanteen._id);  
      
      resetForm();
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  const updateOwnerStatus = async (canteenId) => {
    if (!canteenId) {
      console.error('No canteen ID provided');
      alert('Error: No canteen selected');
      return;
    }

    try {
      const updatedData = { 
        ownerstatus: owner.email, 
        lastUpdated: new Date().toISOString() 
      };

      const response = await fetch(`/api/updatecanteen?id=${canteenId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to update canteen status for ID: ${canteenId}`);
      }

      const updatedCanteen = await response.json();
      console.log('Canteen updated successfully:', updatedCanteen);

      // Refresh the canteens list after update
      fetchCanteens();
    } catch (error) {
      console.error('Error updating canteen status:', error);
      alert(`Failed to update canteen: ${error.message}`);
    }
  };

  const resetForm = () => {
    setOwner({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      nicNumber: "",
      password: "",
      confirmPassword: "",
      selectcanteen: "",
    });
  };

  return (
    <div className="max-w-lg p-8 mx-auto text-white bg-gray-800 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        {/* Name Fields */}
        <div className="flex mb-4 space-x-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={owner.firstName}
              onChange={handleInputChange}
              className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring focus:ring-orange-500"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={owner.lastName}
              onChange={handleInputChange}
              className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={owner.email}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring focus:ring-orange-500"
          />
        </div>

        {/* Phone & NIC Fields */}
        <div className="flex mb-4 space-x-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={owner.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none focus:ring focus:ring-orange-500"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">NIC Number</label>
            <input
              type="text"
              name="nicNumber"
              value={owner.nicNumber}
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
              value={owner[field]}
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

        {/* Canteen Select */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Select Canteen</label>
          <select
            name="selectcanteen"
            value={owner.selectcanteen}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none"
          >
            <option value="">Select Canteen</option>
            {canteens.map(({ _id, canteenName }) => (
              <option key={_id} value={canteenName}>
                {canteenName}
              </option>
            ))}
          </select>
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