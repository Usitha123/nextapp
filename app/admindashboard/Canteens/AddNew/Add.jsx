"use client";
import { useState } from 'react';

export default function AddCanteens() {
  const [activeTab, setActiveTab] = useState('canteen');
  const [canteenProgress, setCanteenProgress] = useState(0);
  const [canteenImageSrc, setCanteenImageSrc] = useState(null);
  const [canteenImageURL, setCanteenImageURL] = useState('');

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

  // Handle input changes for canteen details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCanteenDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  // Handle file change (image upload)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my-uploads'); // replace with your Cloudinary upload preset

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/dtvsl05hw/image/upload');

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setCanteenProgress(percent);
      }
    };

    xhr.onload = () => {
      const response = JSON.parse(xhr.responseText);
      setCanteenImageSrc(response.secure_url);
      setCanteenImageURL(response.secure_url);
    };

    xhr.send(formData);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCanteenForm()) {
      alert("Please fill out all canteen details.");
      return;
    }

    const fullData = {
      ...canteenDetails,
      canteenImageURL,
    };

    try {
      const response = await fetch('/api/canteens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullData),
      });

      if (!response.ok) throw new Error('Failed to add canteen.');

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting the form.');
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
      </div>

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
            placeholder="Open Hour"
            value={canteenDetails.openHour}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            required
          />
          <input
            type="text"
            name="closedHour"
            placeholder="Closed Hour"
            value={canteenDetails.closedHour}
            onChange={handleInputChange}
            className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md"
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={canteenDetails.phoneNumber}
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
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-600 rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
