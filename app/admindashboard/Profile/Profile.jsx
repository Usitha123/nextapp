'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";

const InfoField = ({ label, value }) => (
  <div>
    <label className="block text-sm text-orange-500">{label}</label>
    <div className="w-full p-1 text-gray-300 bg-[#3B3737] rounded-md">
      {value || 'N/A'}
    </div>
  </div>
);

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('/api/viewadminprofile');
        if (!response.ok) throw new Error('Failed to fetch admin data');

        const data = await response.json();
        const loggedInAdmin = data.find(
          (s) => s.email === session?.user?.email
        );
        setAdmin(loggedInAdmin || null);
      } catch (err) {
        setError(err.message || 'Error fetching admin details.');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [session?.user?.email]);

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!admin) return <div className="text-gray-400">No profile found.</div>;

  return (
    <div className="bg-[#2B2623] p-8 rounded-md shadow-lg w-full max-w-xl mx-auto">
      <div className="space-y-4">

        {/* First + Last Name side by side */}
        <div className="flex gap-2 mt-6">
          <div className="flex-1">
            <InfoField label="First Name" value={admin.firstName} />
          </div>
          <div className="flex-1">
            <InfoField label="Last Name" value={admin.lastName} />
          </div>
        </div>

        <InfoField label="Phone" value={admin.phone} />
        <InfoField label="Email" value={admin.email} />
        <InfoField label="NIC Number" value={admin.nic} />

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
