"use client";
import { useState } from 'react';
import Image from 'next/image';

export default function AddCanteens() {
  const [activeTab, setActiveTab] = useState('canteen');
  const [progress, setProgress] = useState(0);
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
    date: '',
    image: null, // This will hold the file object
    phoneNumber: '',
  });

  // State for owner details
  const [ownerDetails, setOwnerDetails] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    ownerEmail: '',
    nic: '',
    ownerDate: '',
    password: '',
    confirmPassword: '',
    image: null, // This will hold the file object for owner
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
  const handleFileChange = async (e, section) => {
    const file = e.target.files[0];
    if (!file) return;

    // Update the state with the selected file
    if (section === 'canteen') {
      setCanteenDetails((prev) => ({
        ...prev,
        image: file, // Store the file object
      }));
    } else {
      setOwnerDetails((prev) => ({
        ...prev,
        image: file, // Store the file object
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
        setProgress(percent);
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
      setProgress(100);
    };

    xhr.send(formData);
  };

  // Handle the 'Next' button click
  const handleNext = (e) => {
    e.preventDefault();
    setActiveTab('owner');
  };

  // Handle the 'Back' button click
  const handleBack = (e) => {
    e.preventDefault();
    setActiveTab('canteen');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for missing fields in both canteen and owner details
    const isCanteenComplete = Object.values(canteenDetails).every(field => field !== '' && field !== null);
    const isOwnerComplete = Object.values(ownerDetails).every(field => field !== '' && field !== null);

    // Show specific alerts for missing fields
    if (!isCanteenComplete) {
      alert("Please fill in all canteen details.");
      return;
    }

    if (!isOwnerComplete) {
      alert("Please fill in all owner details.");
      return;
    }

    if (!canteenImageURL || !ownerImageURL) {
      alert("Please upload an image.");
      return;
    }

    const fullData = { ...canteenDetails, ...ownerDetails, canteenImageURL, ownerImageURL };

    // Log the submitted data in JSON format
    console.log('Form submitted successfully:', JSON.stringify(fullData, null, 2));

    // Handle form submission logic here (e.g., send data to API)
    alert("Form submitted!");
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
                <img src={canteenDetails.image ? URL.createObjectURL(canteenDetails.image) : "/placeholder.png"} alt="Upload" className="object-cover w-full h-full" />
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
            {progress > 0 && <p>{progress}% Uploaded</p>}
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
            <input
              type="date"
              name="date"
              value={canteenDetails.date}
              onChange={(e) => handleInputChange(e, 'canteen')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
              required
            />
          </div>
        ) : (
          <div className="space-y-4">
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
              placeholder="Owner Email Address"
              value={ownerDetails.ownerEmail}
              onChange={(e) => handleInputChange(e, 'owner')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
              required
            />
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
              type="file"
              onChange={(e) => handleFileChange(e, 'owner')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
              required
            />
            {progress > 0 && <p>{progress}% Uploaded</p>}
            <input
              type="text"
              name="nic"
              placeholder="NIC"
              value={ownerDetails.nic}
              onChange={(e) => handleInputChange(e, 'owner')}
              className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
              required
            />
            <input
              type="date"
              name="ownerDate"
              value={ownerDetails.ownerDate}
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
          </div>
        )}

        <div className="flex justify-between mt-4">
          {activeTab === 'owner' && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-white bg-gray-600 rounded-md"
            >
              Back
            </button>
          )}
          <div>
            {activeTab === 'canteen' ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 text-black bg-orange-500 rounded-md"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 text-black bg-orange-500 rounded-md"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
