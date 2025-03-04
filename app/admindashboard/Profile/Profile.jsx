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
    <div className=" bg-[#2B2623] p-8 rounded-md shadow-lg w-full max-w-xl mx-auto">

      <div className="space-y-4">

        <div className='flex gap-2 mt-6'>
 {/* First Name */}
 <div className='flex-1'>
          <label className="block text-sm text-orange-500">First Name</label>
          <div className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md">
            {admin.firstName || 'N/A'}
          </div>
        </div>

        {/* Last Name */}
        <div className='flex-1'>
          <label className="block text-sm text-orange-500">Last Name</label>
          <div className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md">
            {admin.lastName || 'N/A'}
          </div>
        </div>
        </div>
       

        {/* Phone */}
        <div>
          <label className="block text-sm text-orange-500">Phone</label>
          <div className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md">
            {admin.phone || 'N/A'}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-orange-500">Email</label>
          <div className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md">
            {admin.email || 'N/A'}
          </div>
        </div>

        {/* NIC Number */}
        <div>
          <label className="block text-sm text-orange-500">NIC Number</label>
          <div className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md">
            {admin.nic || 'N/A'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <Link
            href="/admindashboard/Profile/Edit"
            className="px-2 py-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
