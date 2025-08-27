'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useSession } from "next-auth/react";

const UpdateAdminProfile = () => {
  const router = useRouter();
  const [admin, setAdmin] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    nic: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { data: session } = useSession();

  // Fetch admin profile data on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('/api/viewadminprofile');
        if (!response.ok) throw new Error('Failed to fetch admin data');
        const data = await response.json();
        setAdmin({ ...data, password: '', confirmPassword: '' });
      } catch (err) {
        setError(err.message || 'Error fetching admin details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (admin.password !== admin.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const updatedAdmin = { ...admin, password: admin.password };
      const response = await fetch('/api/updateadminprofile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAdmin),
      });

      if (!response.ok) throw new Error(await response.text());
      router.push('/admindashboard');
    } catch (err) {
      setError(err.message || 'Failed to update admin.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-[#2B2623] p-6 rounded-md shadow-lg w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div className='flex gap-2'>
        <div className='flex-1'>
          <label className="block text-sm text-orange-500">First Name</label>
          <input
            type="text"
            name="firstName"
            value={admin.firstName}
            onChange={handleChange}
            className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md"
          />
        </div>

        {/* Last Name */}
        <div className='flex-1'>
          <label className="block text-sm text-orange-500">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={admin.lastName}
            onChange={handleChange}
            className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md"
          />
        </div>
        </div>
        
        <div className='flex gap-2'> 
          {/* Phone */}
        <div className='flex-1'>
          <label className="block text-sm text-orange-500">Phone</label>
          <input
            type="text"
            name="phone"
            value={admin.phone}
            onChange={handleChange}
            className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md"
          />
        </div>
        
        {/* NIC Number */}
        <div className='flex-1'>
          <label className="block text-sm text-orange-500">NIC Number</label>
          <input
            type="text"
            name="nic"
            value={admin.nic}
            onChange={handleChange}
            className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md"
          />
        </div>
        </div>
        

        {/* Email */}
        <div>
          <label className="block text-sm text-orange-500">Email</label>
          <input
            type="email"
            name="email"
            value={admin.email}
            onChange={handleChange}
            className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md"
          />
        </div>


        <div className='flex gap-2'>
          
        {/* Password */}
        <div className='flex-1'>
          <label className="block text-sm text-orange-500">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={admin.password}
              onChange={handleChange}
              className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md"
              placeholder="Password"
              aria-label="Password"
            />
            <button
              type="button"
              className="absolute inset-y-0 flex items-center text-gray-600 right-3 hover:text-orange-500 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className='flex-1'>
          <label className="block text-sm text-orange-500">Confirm Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={admin.confirmPassword}
            onChange={handleChange}
            className="w-full p-1 text-gray-300 bg-[#3B3737]  rounded-md"
            placeholder="Confirm Password"
          />
        </div>
        </div>


        {/* Submit Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            type="submit"
            className="px-3 py-1 text-white bg-orange-500 rounded-xl hover:bg-orange-400 focus:outline-none"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => router.push('/admindashboard')}
            className=" px-3 py-1 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAdminProfile;
