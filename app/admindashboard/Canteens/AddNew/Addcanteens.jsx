"use client";
import { Image } from "lucide-react";
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
      const response = await fetch("/api/addcanteens", {
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
    <div className="w-full md:w-[90%] p-6 mx-auto text-gray-400 bg-[#2B2623] rounded-md">
      {/* <h2 className="mb-4 text-xl font-bold">Add Canteens</h2> */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Image Preview */}
        <div>
          <label className="block text-sm text-orange-500 mb-1">Image Preview</label>
          <div className="w-full h-80 bg-[#3B3737] rounded-md flex items-center justify-center overflow-hidden">
            {canteenImageSrc ? (
              <img
                src={canteenDetails.image ? URL.createObjectURL(canteenDetails.image) : canteenImageSrc}
                alt="Canteen Upload"
                className="object-cover w-full h-full"
              />
            ) : (
              <Image className="text-gray-500 w-20 h-20" />
            )}
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="canteenName" className="block text-sm text-orange-500 mb-1">Canteen Name</label>
                  <input
                    type="text"
                    name="canteenName"
                    value={canteenDetails.canteenName}
                    onChange={handleInputChange}
                    className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md h-11"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="businessEmail" className="block text-sm text-orange-500 mb-1">Business Email</label>
                  <input
                    type="email"
                    name="businessEmail"
                    value={canteenDetails.businessEmail}
                    onChange={handleInputChange}
                    className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md h-11"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm text-orange-500 mb-1">Image</label>
                  <div className="h-11 flex ">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md file:cursor-pointer file:px-3 file:rounded-md file:border-0 file:text-white file:bg-[#5E5E63CF] hover:file:bg-orange-500 h-full"
                      required
                    />
                  </div>
                  {canteenProgress > 0 && (
                    <div className="mt-1">
                      <p className="text-xs text-gray-400">{canteenProgress}% Uploaded</p>
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="openHour" className="block text-sm text-orange-500 mb-1">Open Hour</label>
                  <input
                    type="time"
                    name="openHour"
                    placeholder="HH:MM"
                    value={canteenDetails.openHour}
                    onChange={handleInputChange}
                    className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md h-11"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="closedHour" className="block text-sm text-orange-500 mb-1">Closed Hour</label>
                  <input
                    type="time"
                    name="closedHour"
                    placeholder="HH:MM"
                    value={canteenDetails.closedHour}
                    onChange={handleInputChange}
                    className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md h-11"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm text-orange-500 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="10 digits"
                    value={canteenDetails.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md h-11"
                    required
                    pattern="^[0-9]{10}$"
                  />
                </div>
                <div>
                  <label htmlFor="openingDate" className="block text-sm text-orange-500 mb-1">Opening Date</label>
                  <input
                    type="date"
                    name="openingDate"
                    value={canteenDetails.openingDate}
                    onChange={handleInputChange}
                    className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md h-11"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm text-orange-500 mb-1">Status</label>
                  <select
                    name="status"
                    value={canteenDetails.status}
                    onChange={handleInputChange}
                    className="w-full p-2 text-gray-300 bg-[#3B3737] rounded-md h-11"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button type="submit" className="px-4 py-2 my-3 text-white bg-orange-500 rounded-md hover:bg-orange-600">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}