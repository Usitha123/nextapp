"use client";
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';


export default function AddOwners() {
  const [ownerProgress, setOwnerProgress] = useState(0);
  const [ownerImageSrc, setOwnerImageSrc] = useState(null);
  const [ownerImageURL, setOwnerImageURL] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [canteens, setCanteens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();
  
  const [ownerDetails, setOwnerDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    image: "",
    phoneNumber: "",
    nicNumber: "",
    status: "Active",
    createDate: "",
    selectcanteen: "",
    password: "",
    confirmPassword: "", // Added confirmPassword
  });

  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        const res = await fetch("/api/allcanteenslist", { headers: { "Content-Type": "application/json" } });
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        const inactiveCanteens = data.filter(canteen => canteen.ownerstatus === "Inactive");
        setCanteens(inactiveCanteens);
      } catch (err) {
        console.error("Error fetching canteens:", err);
        setError("Failed to load canteens.");
      } finally {
        setLoading(false);
      }
    };

    fetchCanteens();
  }, []);

  useEffect(() => setIsMounted(true), []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOwnerDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my-uploads");

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

    xhr.onerror = () => alert("Failed to upload the image. Please try again.");

    xhr.send(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Frontend password confirmation check
    if (ownerDetails.password !== ownerDetails.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
  
    const fullData = {
      ...ownerDetails,
      image: ownerImageURL, // Including the image URL
    };
  
    // Remove confirmPassword before sending to the backend
    delete fullData.confirmPassword;
  
    try {
      const response = await fetch("/api/ownerDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        // Log the detailed error message for better debugging
        console.error("API error:", result);
        throw new Error(result.message || "Failed to add owner.");
      }
  
      alert(result.message || "Owner added successfully!");
      resetForm();
    } catch (err) {
      // Show the error details for debugging
      console.error("Submission error:", err);
      alert("There was an error submitting the form. See console for details.");
    }
  };
  

  const resetForm = () => {
    setOwnerDetails({
      firstName: "",
      lastName: "",
      email: "",
      image: "",
      phoneNumber: "",
      nicNumber: "",
      status: "Active",
      createDate: "",
      selectcanteen: "",
      password: "",
      confirmPassword: "", // Reset confirmPassword
    });
    setOwnerImageSrc(null);
    setOwnerImageURL("");
    setOwnerProgress(0);
  };

  const validateOwnerForm = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const nicRegex = /^[0-9]{12}$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const { firstName, lastName, phoneNumber, nicNumber, createDate, email, selectcanteen, password } = ownerDetails;

    return (
      firstName &&
      lastName &&
      email &&
      phoneNumber &&
      nicNumber &&
      createDate &&
      phoneRegex.test(phoneNumber) &&
      nicRegex.test(nicNumber) &&
      dateRegex.test(createDate) &&
      password &&
      selectcanteen
    );
  };

  if (!isMounted || loading) return <p>Loading...</p>;

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
            name="email"
            placeholder="Email"
            value={ownerDetails.email}
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
          <select
            name="selectcanteen"
            value={ownerDetails.selectcanteen}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            required
          >
            <option value="">Select Canteen</option>
            {canteens.map(canteen => (
              <option key={canteen._id} value={canteen._id}>
                {canteen.canteenName}
              </option>
            ))}
          </select>
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
        </div>
        <button
          type="submit"
          disabled={!validateOwnerForm()}
          className="w-full py-2 mt-4 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          Add Cashier
        </button>
      </form>
    </div>
  );
}
