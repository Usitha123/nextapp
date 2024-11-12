"use client";
import { useState } from 'react';

export default function AddCanteens() {
  const [activeTab, setActiveTab] = useState('canteen');

  // State for canteen details
  const [canteenDetails, setCanteenDetails] = useState({
    canteenName: '',
    businessEmail: '',
    openHour: '',
    closedHour: '',
    status: '',
    date: '',
    image: null,
  });

  // State for owner details
  const [ownerDetails, setOwnerDetails] = useState({
    ownerName: '',
    contactNumber: '',
    ownerAddress: '',
  });

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section === 'canteen') {
      setCanteenDetails((prev) => ({ ...prev, [name]: value }));
    } else {
      setOwnerDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setCanteenDetails((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setActiveTab('owner');
  };

  const handleBack = (e) => {
    e.preventDefault();
    setActiveTab('canteen');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(canteenDetails).some(field => !field) || 
        Object.values(ownerDetails).some(field => !field)) {
      alert("Please fill in all fields.");
      return;
    }
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
            <input type="text" name="canteenName" placeholder="Canteen Name" value={canteenDetails.canteenName} onChange={(e) => handleInputChange(e, 'canteen')} className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md" required />
            <input type="email" name="businessEmail" placeholder="Business Email" value={canteenDetails.businessEmail} onChange={(e) => handleInputChange(e, 'canteen')} className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md" required />
            <input type="file" onChange={handleFileChange} className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md" />
            <input type="text" name="openHour" placeholder="Open Hour" value={canteenDetails.openHour} onChange={(e) => handleInputChange(e, 'canteen')} className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md" required />
            <input type="text" name="closedHour" placeholder="Closed Hour" value={canteenDetails.closedHour} onChange={(e) => handleInputChange(e, 'canteen')} className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md" required />
            <input type="date" name="date" value={canteenDetails.date} onChange={(e) => handleInputChange(e, 'canteen')} className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md" required />
            <select name="status" value={canteenDetails.status} onChange={(e) => handleInputChange(e, 'canteen')} className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md" required>
              <option value="">Status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        ) : (
          <div className="space-y-4">
            <input type="text" name="ownerName" placeholder="Owner Name" value={ownerDetails.ownerName} onChange={(e) => handleInputChange(e, 'owner')} className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md" required />
            <input type="text" name="contactNumber" placeholder="Contact Number" value={ownerDetails.contactNumber} onChange={(e) => handleInputChange(e, 'owner')} className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md" required />
            <input type="text" name="ownerAddress" placeholder="Owner Address" value={ownerDetails.ownerAddress} onChange={(e) => handleInputChange(e, 'owner')} className="w-full p-2 text-white bg-gray-800 border border-gray-600 rounded-md" required />
          </div>
        )}

        <div className="flex justify-between mt-4">
          {activeTab === 'owner' && (
            <button onClick={handleBack} className="px-4 py-2 text-black bg-gray-500 rounded-md">
              Back
            </button>
          )}
          {activeTab === 'canteen' ? (
            <button onClick={handleNext} className="px-4 py-2 text-black bg-orange-500 rounded-md">
              Next
            </button>
          ) : (
            <button type="submit" className="px-4 py-2 text-black bg-orange-500 rounded-md">
              Save
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
