'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

const InputField = ({ label, name, type = 'text', value, onChange, ...props }) => (
  <div className="flex-1">
    <label className="block text-sm text-orange-500">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
      {...props}
    />
  </div>
);

const PasswordField = ({ label, name, value, onChange, showPassword, toggleShow }) => (
  <div className="flex-1">
    <label className="block text-sm text-orange-500">{label}</label>
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md"
        placeholder={label}
      />
      <button
        type="button"
        className="absolute inset-y-0 flex items-center text-gray-600 right-3 hover:text-orange-500"
        onClick={toggleShow}
      >
        {showPassword ? <FaEye /> : <FaEyeSlash />}
      </button>
    </div>
  </div>
);

const UpdateAdminProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();

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

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/viewadminprofile');
        if (!res.ok) throw new Error('Failed to fetch admin data');

        const data = await res.json();
        const loggedInAdmin = data.find((a) => a.email === session.user.email);

        if (loggedInAdmin) {
          setAdmin({ ...loggedInAdmin, password: '', confirmPassword: '' });
        } else {
          setError('Admin profile not found.');
        }
      } catch (err) {
        setError(err.message || 'Error fetching admin details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [session?.user?.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!/^\d{10}$/.test(admin.phone)) return alert('Phone number must be exactly 10 digits');
    if (!/^\d{12}$/.test(admin.nic)) return alert('NIC number must be exactly 12 digits');
    if (!admin.password.trim() || !admin.confirmPassword.trim()) return alert('Password fields cannot be empty');
    if (admin.password !== admin.confirmPassword) return alert('Passwords do not match');

    setLoading(true);
    try {
      const res = await fetch('/api/updateadminprofile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(admin),
      });
      if (!res.ok) throw new Error(await res.text());
      router.push('/admindashboard');
    } catch (err) {
      setError(err.message || 'Failed to update admin.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="bg-[#2B2623] p-6 rounded-md shadow-lg w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <InputField label="First Name" name="firstName" value={admin.firstName} onChange={handleChange} />
          <InputField label="Last Name" name="lastName" value={admin.lastName} onChange={handleChange} />
        </div>

        <div className="flex gap-2">
          <InputField label="Phone" name="phone" value={admin.phone} onChange={handleChange} placeholder="10-digit phone" />
          <InputField label="NIC Number" name="nic" value={admin.nic} onChange={handleChange} placeholder="12-digit NIC" />
        </div>

        <InputField label="Email" type="email" name="email" value={admin.email} onChange={handleChange} />

        <div className="flex gap-2">
          <PasswordField
            label="Password"
            name="password"
            value={admin.password}
            onChange={handleChange}
            showPassword={showPassword}
            toggleShow={() => setShowPassword((prev) => !prev)}
          />
          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            value={admin.confirmPassword}
            onChange={handleChange}
            showPassword={showPassword}
            toggleShow={() => setShowPassword((prev) => !prev)}
          />
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        <div className="flex justify-end mt-6 space-x-4">
          <button type="submit" className="px-3 py-1 text-white bg-orange-500 rounded-xl hover:bg-orange-400">
            Save
          </button>
          <button
            type="button"
            onClick={() => router.push('/admindashboard')}
            className="px-3 py-1 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAdminProfile;
