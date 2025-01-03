'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const Profile = () => {
  const [admin, setAdmin] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    nic: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch admin profile data on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('/api/viewadminprofile');
        if (!response.ok) throw new Error('Failed to fetch admin data');
        const data = await response.json();
        setAdmin({ ...data });
      } catch (err) {
        setError(err.message || 'Error fetching admin details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-[#1b1b1b] p-6 rounded-md shadow-lg w-full max-w-xl mx-auto">
      <h2 className="mb-6 text-2xl font-semibold text-white">Profile</h2>
      <div className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block text-sm text-gray-400">First Name</label>
          <div className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md">
            {admin.firstName || 'N/A'}
          </div>
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm text-gray-400">Last Name</label>
          <div className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md">
            {admin.lastName || 'N/A'}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm text-gray-400">Phone</label>
          <div className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md">
            {admin.phone || 'N/A'}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-400">Email</label>
          <div className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md">
            {admin.email || 'N/A'}
          </div>
        </div>

        {/* NIC Number */}
        <div>
          <label className="block text-sm text-gray-400">NIC Number</label>
          <div className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md">
            {admin.nic || 'N/A'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <Link
            href="/admindashboard/Profile/Edit"
            className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-400 focus:outline-none"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
