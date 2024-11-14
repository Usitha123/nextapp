"use client";
import { useState, useEffect } from "react";

export default function AddCanteens() {
  const [canteenProgress, setCanteenProgress] = useState(0);
  const [canteenImageSrc, setCanteenImageSrc] = useState(null);
  const [canteenImageURL, setCanteenImageURL] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // State for canteen details
  const [canteenDetails, setCanteenDetails] = useState({
    canteenName: "",
    businessEmail: "",
    openHour: "",
    closedHour: "",
    image: null,
    phoneNumber: "",
    status: "Active", // default status
    openingDate: "", // added date field
    ownerstatus: "Inactive", // default owner status
  });

  // Run after the first render to indicate client-side rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCanteenDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file change (image upload)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Update the state with the selected file
    setCanteenDetails((prev) => ({
      ...prev,
      image: file,
    }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my-uploads"); // replace with your Cloudinary upload preset

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.cloudinary.com/v1_1/dtvsl05hw/image/upload");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setCanteenProgress(percent);
      }
    };

    xhr.onload = () => {
      const response = JSON.parse(xhr.responseText);
      console.log("Cloudinary Response:", response); // Debugging log
      setCanteenImageSrc(response.secure_url);
      setCanteenImageURL(response.secure_url);
    };

    xhr.onerror = () => {
      console.error("Error uploading image to Cloudinary");
      alert("Failed to upload the image. Please try again.");
    };

    xhr.send(formData);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateCanteenForm()) {
      alert("Please fill out all canteen details correctly.");
      return;
    }

    const fullData = {
      ...canteenDetails,
      image: canteenImageURL, // Use the uploaded image URL
    };

    console.log("Submitted Data:", fullData); // Debugging log

    try {
      const response = await fetch("/api/Canteens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("API Error:", result); // Log API error details
        throw new Error(result.message || "Failed to add canteen.");
      }

      alert(result.message || "Canteen added successfully!");

      // Clear form fields after successful submission
      setCanteenDetails({
        canteenName: "",
        businessEmail: "",
        openHour: "",
        closedHour: "",
        image: null,
        phoneNumber: "",
        status: "Active",
        openingDate: "",
        ownerstatus: "Inactive",
      });

      setCanteenImageSrc(null);
      setCanteenImageURL("");
      setCanteenProgress(0);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form.");
    }
  };

  // Validate canteen form
  const validateCanteenForm = () => {
    const phoneRegex = /^[0-9]{10}$/; // Phone number should be 10 digits
    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/; // HH:MM format for hours
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Check if the openingDate is a valid date string

    const { phoneNumber, openHour, closedHour, openingDate, canteenName, businessEmail } = canteenDetails;

    return (
      canteenName &&
      businessEmail &&
      phoneNumber &&
      openHour &&
      closedHour &&
      openingDate &&
      phoneRegex.test(phoneNumber) &&
      timeRegex.test(openHour) &&
      timeRegex.test(closedHour) &&
      dateRegex.test(openingDate) &&
      canteenImageURL
    );
  };

  // Render content only after client-side has mounted
  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full max-w-lg p-6 mx-auto text-white bg-gray-900 rounded-md">
      <h2 className="mb-4 text-xl font-bold">Update Canteen</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center w-20 h-20 bg-gray-700 rounded-md">
              <img
                src={canteenDetails.image ? URL.createObjectURL(canteenDetails.image) : "/placeholder.png"}
                alt="Canteen Upload"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <input
            type="text"
            name="canteenName"
            placeholder="Canteen Name"
            value={canteenDetails.canteenName}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            required
          />
          <input
            type="email"
            name="businessEmail"
            placeholder="Business Email"
            value={canteenDetails.businessEmail}
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
          {canteenProgress > 0 && <p>{canteenProgress}% Uploaded</p>}
          <input
            type="text"
            name="openHour"
            placeholder="Open Hour (HH:MM)"
            value={canteenDetails.openHour}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            required
          />
          <input
            type="text"
            name="closedHour"
            placeholder="Closed Hour (HH:MM)"
            value={canteenDetails.closedHour}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number (10 digits)"
            value={canteenDetails.phoneNumber}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            required
            pattern="^[0-9]{10}$"
          />
          <input
            type="date"
            name="openingDate"
            value={canteenDetails.openingDate}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            required
          />
          <select
            name="status"
            value={canteenDetails.status}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
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
