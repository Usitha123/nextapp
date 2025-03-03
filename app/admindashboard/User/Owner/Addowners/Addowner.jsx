"use client";
import { Eye, EyeOff } from "lucide-react";
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
    <div className="w-full md:max-w-3xl p-6 mx-auto text-gray-400 bg-[#2B2623] rounded-md">
      <form onSubmit={handleSubmit}>
        {/* Name Fields */}
        <div className="flex mb-4 space-x-4">
          <div className="flex-1">
            <label className="p-1 text-orange-500 text-sm">First Name</label>
            <input
              type="text"
              name="firstName"
              value={owner.firstName}
              onChange={handleInputChange}
              className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md"
            />
          </div>
          <div className="flex-1">
            <label className="p-1 text-orange-500 text-sm">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={owner.lastName}
              onChange={handleInputChange}
              className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md "
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="flex mb-4 space-x-4">
        <div className="flex-1">
          <label className="p-1 text-orange-500 text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={owner.email}
            onChange={handleInputChange}
            className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md"
          />
        </div>
        <div className="flex-1">
          <label className="p-1 text-orange-500 text-sm">Select Canteen</label>
          <select
            name="selectcanteen"
            value={owner.selectcanteen}
            onChange={handleInputChange}
            className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md"
          >
            <option value="">Select Canteen</option>
            {canteens.map(({ _id, canteenName }) => (
              <option key={_id} value={canteenName}>
                {canteenName}
              </option>
            ))}
          </select>
        </div>
        </div>

        {/* Phone & NIC Fields */}
        <div className="flex mb-4 space-x-4">
          <div className="flex-1">
            <label className="p-1 text-orange-500 text-sm">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={owner.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md"
            />
          </div>
          <div className="flex-1">
            <label className="p-1 text-orange-500 text-sm">NIC Number</label>
            <input
              type="text"
              name="nicNumber"
              value={owner.nicNumber}
              onChange={handleInputChange}
              className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md"
            />
          </div>
        </div>

        {/* Password Fields */}
        {["password", "confirmPassword"].map((field) => (
          <div key={field} className="relative mb-4">
            <label className="p-1 text-orange-500 text-sm">
              {field === "password" ? "Password" : "Confirm Password"}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name={field}
              value={owner[field]}
              onChange={handleInputChange}
              className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md"
            />
            <span
              className="absolute flex items-center text-gray-400 cursor-pointer right-3 bottom-2"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/> }
            </span>
          </div>
        ))}

        {/* Canteen Select */}
        

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="flex items-center gap-0 px-2 py-1 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
            onClick={resetForm}
          >
            Cancel
          </button>
          <button
            type="submit"
            className=" px-4 py-2 text-sm font-medium  bg-orange-500 text-black border border-orange-500 rounded-xl hover:bg-orange-600 transition"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCashierForm;