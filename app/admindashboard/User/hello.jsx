import React from 'react';

const FormComponent = () => {

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      nicNumber: e.target.nicNumber.value,
      imageURL: e.target.imageURL.value, // Capture the image URL
    };

    // Send data to the new API endpoint
    const response = await fetch('/api/owner', {  // Ensure the endpoint is '/api/owner'
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Owner saved successfully!');
    } else {
      const error = await response.json();
      alert(`Failed to save owner: ${error.error || 'Unknown error'}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-96">
        <h2 className="mb-6 text-2xl font-bold text-center text-white">Owner Registration Form</h2>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-4">
            <label className="mb-2 text-sm text-gray-300">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              className="w-full px-4 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="mb-2 text-sm text-gray-300">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="w-full px-4 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="mb-2 text-sm text-gray-300">Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              className="w-full px-4 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="mb-2 text-sm text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="mb-2 text-sm text-gray-300">NIC Number</label>
            <input
              type="text"
              name="nicNumber"
              placeholder="NIC Number"
              className="w-full px-4 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col mb-6">
            <label className="mb-2 text-sm text-gray-300">Image URL</label>
            <input
              type="url"
              name="imageURL"
              placeholder="Enter image URL"
              className="w-full px-4 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 text-orange-400 bg-gray-700 rounded hover:bg-gray-600 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600 focus:outline-none"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormComponent;
