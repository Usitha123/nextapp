'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import UpdateStatusModal from './ChangePassword';

const UpdateAdminProfile = () => {
  const router = useRouter();
  const [admin, setAdmin] = useState(null); // Store admin data
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(null); // Handle error state
  const [isModalOpen, setIsModalOpen] = useState(false); // For the password modal

  // Fetch admin profile data on component mount
  useEffect(() => {
    setLoading(true);

    fetch(`/api/viewadminprofile`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch admin data');
        }
        return res.json();
      })
      .then((data) => {
        setAdmin(data); // Populate the state with fetched data
      })
      .catch((err) => {
        setError(err.message || 'Error fetching admin details.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({
      ...prev,
      [name]: value, // Dynamically update the admin state
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/updateadminprofile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(admin), // Send updated admin data
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const updatedAdmin = await response.json();
      console.log('Admin updated:', updatedAdmin);

      // Redirect to the admin dashboard after successful update
      router.push('/admindashboard');
    } catch (err) {
      setError(err.message || 'Failed to update admin.');
    } finally {
      setLoading(false);
    }
  };

  // Render loading, error, or form
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!admin) {
    return <div>No admin data available.</div>;
  }

  return (
    <div className="bg-[#1b1b1b] p-6 rounded-md shadow-lg w-full max-w-xl mx-auto">
      <h2 className="mb-6 text-2xl font-semibold text-white">Profile</h2>
      <div className="flex items-start space-x-6">
        <form className="flex-1 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400">First Name</label>
              <input
                type="text"
                name="firstName"
                value={admin.firstName || ''}
                onChange={handleChange}
                className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={admin.lastName || ''}
                onChange={handleChange}
                className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400">Phone</label>
              <input
                type="text"
                name="phone"
                value={admin.phone || ''}
                onChange={handleChange}
                className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Phone"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                value={admin.email || ''}
                onChange={handleChange}
                className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400">NIC Number</label>
            <input
              type="text"
              name="nicNumber"
              value={admin.nicNumber || ''}
              onChange={handleChange}
              className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="NIC Number"
            />
          </div>

          <div className="mt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-orange-500 hover:underline focus:outline-none"
            >
              Change Password
            </button>
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-400 focus:outline-none"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => router.push('/admindashboard')}
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Modal */}
      <UpdateStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

const SuspendedUpdateAdminProfile = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <UpdateAdminProfile />
  </Suspense>
);

export default SuspendedUpdateAdminProfile;
