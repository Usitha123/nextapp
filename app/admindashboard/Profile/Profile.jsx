'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const UpdateAdminProfile = () => {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch admin profile data on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('/api/viewadminprofile');
        if (!response.ok) throw new Error('Failed to fetch admin data');
        const data = await response.json();
        setAdmin({
          ...data,
          password: '', // Reset the password field to prevent auto-fill
          confirmPassword: '', // Reset confirm password to prevent auto-fill
        });
      } catch (err) {
        setError(err.message || 'Error fetching admin details.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  // Handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/updateadminprofile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(admin),
      });

      if (!response.ok) throw new Error(await response.text());
      const updatedAdmin = await response.json();
      console.log('Admin updated:', updatedAdmin);

      router.push('/admindashboard');
    } catch (err) {
      setError(err.message || 'Failed to update admin.');
    } finally {
      setLoading(false);
    }
  };

  // Render loading, error, or form
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!admin) return <div>No admin data available.</div>;

  const renderInputField = (name, type = 'text', placeholder) => (
    <div>
      <label className="block text-sm text-gray-400">{placeholder}</label>
      <input
        type={type}
        name={name}
        value={admin[name] || ''}
        onChange={handleChange}
        className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder={placeholder}
        autoComplete="off" // Disable browser autofill
      />
    </div>
  );

  return (
    <div className="bg-[#1b1b1b] p-6 rounded-md shadow-lg w-full max-w-xl mx-auto">
      <h2 className="mb-6 text-2xl font-semibold text-white">Profile</h2>
      <form className="flex-1 space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          {['firstName', 'lastName', 'phone', 'email'].map((field) => (
            <div key={field}>
              {renderInputField(field, field === 'email' ? 'email' : 'text', field.replace(/([A-Z])/g, ' $1'))}
            </div>
          ))}
        </div>

        {renderInputField('nicNumber', 'text', 'NIC Number')}

        <div>
          <label className="block text-sm text-gray-400">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={admin.password || ''}
              onChange={handleChange}
              className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Password"
              autoComplete="off" // Disable browser autofill
            />
            <span
              className="absolute inset-y-0 flex items-center text-gray-600 cursor-pointer right-3"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400">Confirm Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={admin.confirmPassword || ''}
              onChange={handleChange}
              className="w-full p-2 mt-1 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Confirm Password"
              autoComplete="off" // Disable browser autofill
            />
            <span
              className="absolute inset-y-0 flex items-center text-gray-600 cursor-pointer right-3"
            ></span>
          </div>
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
  );
};

const SuspendedUpdateAdminProfile = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <UpdateAdminProfile />
  </Suspense>
);

export default SuspendedUpdateAdminProfile;
