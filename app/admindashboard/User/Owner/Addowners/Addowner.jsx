"use client";
import { useState, useEffect } from "react";

export default function AddOwners() {
  const [ownerProgress, setOwnerProgress] = useState(0);
  const [ownerImageSrc, setOwnerImageSrc] = useState(null);
  const [ownerImageURL, setOwnerImageURL] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // State for owner details
  const [ownerDetails, setOwnerDetails] = useState({
    firstName: "",
    lastName: "",
    ownerEmail: "",
    image: "", // Initially empty
    phoneNumber: "",
    nicNumber: "",
    status: "Active", // Default status
    createDate: "",
    selectcanteen: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOwnerDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file change (image upload)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOwnerDetails((prev) => ({
      ...prev,
      image: file,
    }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my-uploads"); // Replace with your Cloudinary preset

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.cloudinary.com/v1_1/dtvsl05hw/image/upload");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setOwnerProgress(percent);
      }
    };

    xhr.onload = () => {
      const response = JSON.parse(xhr.responseText);
      setOwnerImageSrc(response.secure_url);
      setOwnerImageURL(response.secure_url);
    };

    xhr.onerror = () => {
      alert("Failed to upload the image. Please try again.");
    };

    xhr.send(formData);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password match
    if (ownerDetails.password !== ownerDetails.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate form
    if (!validateOwnerForm()) {
      alert("Please fill out all required details correctly.");
      return;
    }

    const fullData = {
      ...ownerDetails,
      image: ownerImageURL, // Use the uploaded image URL from Cloudinary
    };

    try {
      const response = await fetch("/api/ownerDetails", { // API endpoint updated
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullData),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Failed to add owner.");

      alert(result.message || "Owner added successfully!");

      // Clear form fields after successful submission
      setOwnerDetails({
        firstName: "",
        lastName: "",
        ownerEmail: "",
        image: "",
        phoneNumber: "",
        nicNumber: "",
        status: "Active",
        createDate: "",
        selectcanteen: "",
        password: "",
        confirmPassword: "", // Reset the confirm password
      });

      setOwnerImageSrc(null);
      setOwnerImageURL("");
      setOwnerProgress(0);
    } catch (error) {
      alert("There was an error submitting the form.");
    }
  };

  // Validate owner form
  const validateOwnerForm = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const nicRegex = /^[0-9]{12}$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    const { firstName, lastName, phoneNumber, nicNumber, createDate, ownerEmail, selectcanteen, password, confirmPassword } = ownerDetails;

    return (
      firstName &&
      lastName &&
      ownerEmail &&
      phoneNumber &&
      nicNumber &&
      createDate &&
      phoneRegex.test(phoneNumber) &&
      nicRegex.test(nicNumber) &&
      dateRegex.test(createDate) &&
      password &&
      confirmPassword &&
      password === confirmPassword && // Ensure passwords match
      selectcanteen
    );
  };

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-lg p-6 mx-auto text-white bg-gray-900 rounded-md">
      <h2 className="mb-4 text-xl font-bold">Add Owners</h2>

      {ownerImageSrc && (
        <div className="flex justify-center mb-4">
          <img
            src={ownerImageSrc}
            alt="Uploaded Preview"
            className="object-cover w-32 h-32 border-2 border-gray-600 rounded-full"
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={ownerDetails.firstName}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={ownerDetails.lastName}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            required
          />
          <input
            type="email"
            name="ownerEmail"
            placeholder="Owner Email"
            value={ownerDetails.ownerEmail}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            required
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            required
          />
          {ownerProgress > 0 && <p>{ownerProgress}% Uploaded</p>}
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number (10 digits)"
            value={ownerDetails.phoneNumber}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            required
          />
          <input
            type="text"
            name="nicNumber"
            placeholder="NIC Number (12 digits)"
            value={ownerDetails.nicNumber}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            required
          />
          <input
            type="date"
            name="createDate"
            value={ownerDetails.createDate}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            required
          />
          {/* Password and Confirm Password Fields */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={ownerDetails.password}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={ownerDetails.confirmPassword}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <label className="block text-sm text-gray-400">Owner Status</label>
          <select
            name="status"
            value={ownerDetails.status}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <label className="block text-sm text-gray-400">Canteen Status</label>
          <select
            name="selectcanteen"
            value={ownerDetails.selectcanteen}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
          >
            <option value="open">Open</option>
            <option value="rahula">Rahula</option>
            <option value="gym">Gym</option>
          </select>
        </div>

        <div className="flex justify-between mt-4">
          <button type="submit" className="px-4 py-2 text-white bg-green-600 rounded-md">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
