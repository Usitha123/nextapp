"use client";
import { useState } from 'react';

export default function AddCanteens() {
  const [activeTab, setActiveTab] = useState('canteen');
  const [canteenProgress, setCanteenProgress] = useState(0);
  const [ownerProgress, setOwnerProgress] = useState(0);
  const [canteenImageSrc, setCanteenImageSrc] = useState(null);
  const [ownerImageSrc, setOwnerImageSrc] = useState(null);
  const [canteenImageURL, setCanteenImageURL] = useState('');
  const [ownerImageURL, setOwnerImageURL] = useState('');

  // State for canteen details
  const [canteenDetails, setCanteenDetails] = useState({
    canteenName: '',
    businessEmail: '',
    openHour: '',
    closedHour: '',
    image: null,
    phoneNumber: '',
    status: 'Active', // default status
  });

  // State for owner details
  const [ownerDetails, setOwnerDetails] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    ownerEmail: '',
    nic: '',
    password: '',
    confirmPassword: '',
    image: null,
  });

  // Handle input changes
  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section === 'canteen') {
      setCanteenDetails((prev) => ({ ...prev, [name]: value }));
    } else {
      setOwnerDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle file change (image upload)
  const handleFileChange = (e, section) => {
    const file = e.target.files[0];
    if (!file) return;

    // Update the state with the selected file
    if (section === 'canteen') {
      setCanteenDetails((prev) => ({
        ...prev,
        image: file,
      }));
    } else {
      setOwnerDetails((prev) => ({
        ...prev,
        image: file,
      }));
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my-uploads'); // replace with your Cloudinary upload preset

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/dtvsl05hw/image/upload');

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        if (section === 'canteen') {
          setCanteenProgress(percent);
        } else {
          setOwnerProgress(percent);
        }
      }
    };

    xhr.onload = () => {
      const response = JSON.parse(xhr.responseText);
      if (section === 'canteen') {
        setCanteenImageSrc(response.secure_url);
        setCanteenImageURL(response.secure_url);
      } else {
        setOwnerImageSrc(response.secure_url);
        setOwnerImageURL(response.secure_url);
      }
    };

    xhr.send(formData);
  };

  // Handle the 'Next' button click
  const handleNext = (e) => {
    e.preventDefault();
    if (!validateCanteenForm()) {
      alert("Please fill out all canteen details.");
      return;
    }
    setActiveTab('owner');
  };

  // Handle the 'Back' button click
  const handleBack = (e) => {
    e.preventDefault();
    setActiveTab('canteen');
  };

  // Validate canteen form
  const validateCanteenForm = () => {
    return Object.values(canteenDetails).every(field => field !== '' && field !== null) && canteenImageURL;
  };

  // Validate owner form
  const validateOwnerForm = () => {
    return Object.values(ownerDetails).every(field => field !== '' && field !== null) && ownerImageURL;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // First, validate the owner form before submitting
    if (!validateOwnerForm()) {
      alert("Please fill out all owner details and upload the image.");
      return;
    }

    const fullData = {
      ...canteenDetails,
      canteenImageURL,
      ownerDetails: {
        ...ownerDetails,
        ownerImageURL,
      },
    };

    // Send the data to the API
    try {
      const res = await fetch('/api/Canteens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullData),
      });

      if (res.ok) {
        alert("Canteen and Owner created successfully!");
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting the form.");
    }
  };

  return (
    <div className="w-full max-w-lg p-6 mx-auto text-white bg-gray-900 rounded-md">
      <h2 className="mb-4 text-xl font-bold">Add Canteens</h2>
      <div className="flex mb-4 border-b border-gray-600">
        <button
          type="button"
          className={`flex-1 p-2 ${activeTab === 'canteen' ? 'bg-orange-500 text-black' : 'bg-gray-800'}`}
          onClick={() => setActiveTab('canteen')}
        >
          Canteen Details
        </button>
        <button
          type="button"
          className={`flex-1 p-2 ${activeTab === 'owner' ? 'bg-orange-500 text-black' : 'bg-gray-800'}`}
          onClick={() => setActiveTab('owner')}
        >
          Owner Details
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === 'canteen' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center w-20 h-20 bg-gray-700 rounded-md">
                <img src={canteenDetails.image ? URL.createObjectURL(canteenDetails.image) : "/placeholder.png"} alt="Canteen Upload" className="object-cover w-full h-full" />
              </div>
            </div>
            <input
              type="text"
              name="canteenName"
              placeholder="Canteen Name"
              value={canteenDetails.canteenName}
              onChange={(e) => handleInputChange(e, 'canteen')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
              required
            />
            <input
              type="email"
              name="businessEmail"
              placeholder="Business Email"
              value={canteenDetails.businessEmail}
              onChange={(e) => handleInputChange(e, 'canteen')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
              required
            />
            <input
              type="file"
              onChange={(e) => handleFileChange(e, 'canteen')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
              required
            />
            {canteenProgress > 0 && <p>{canteenProgress}% Uploaded</p>}
            <input
              type="text"
              name="openHour"
              placeholder="Open Hour"
              value={canteenDetails.openHour}
              onChange={(e) => handleInputChange(e, 'canteen')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
              required
            />
            <input
              type="text"
              name="closedHour"
              placeholder="Closed Hour"
              value={canteenDetails.closedHour}
              onChange={(e) => handleInputChange(e, 'canteen')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
              required
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={canteenDetails.phoneNumber}
              onChange={(e) => handleInputChange(e, 'canteen')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
              required
            />
            {/* Removed Date Input */}
            {/* Status Dropdown for Canteen */}
            <select
              name="status"
              value={canteenDetails.status}
              onChange={(e) => handleInputChange(e, 'canteen')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center w-20 h-20 bg-gray-700 rounded-md">
                <img src={ownerDetails.image ? URL.createObjectURL(ownerDetails.image) : "/placeholder.png"} alt="Owner Upload" className="object-cover w-full h-full" />
              </div>
            </div>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={ownerDetails.firstName}
              onChange={(e) => handleInputChange(e, 'owner')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={ownerDetails.lastName}
              onChange={(e) => handleInputChange(e, 'owner')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
              required
            />
            <input
              type="email"
              name="ownerEmail"
              placeholder="Owner Email"
              value={ownerDetails.ownerEmail}
              onChange={(e) => handleInputChange(e, 'owner')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
              required
            />
            <input
              type="file"
              onChange={(e) => handleFileChange(e, 'owner')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
              required
            />
            {ownerProgress > 0 && <p>{ownerProgress}% Uploaded</p>}
            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              value={ownerDetails.contactNumber}
              onChange={(e) => handleInputChange(e, 'owner')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={ownerDetails.password}
              onChange={(e) => handleInputChange(e, 'owner')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={ownerDetails.confirmPassword}
              onChange={(e) => handleInputChange(e, 'owner')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
              required
            />
            <input
              type="text"
              name="nic"
              placeholder="NIC"
              value={ownerDetails.nic}
              onChange={(e) => handleInputChange(e, 'owner')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
              required
            />
          </div>
        )}

        <div className="flex justify-between mt-4">
          {activeTab === 'canteen' && (
            <button
              type="button"
              className="px-4 py-2 text-white bg-blue-600 rounded-md"
              onClick={handleNext}
            >
              Next
            </button>
          )}

          {activeTab === 'owner' && (
            <>
              <button
                type="button"
                className="px-4 py-2 text-white bg-gray-600 rounded-md"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-green-600 rounded-md"
              >
                Submit
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
