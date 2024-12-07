"use client"
import React, { useEffect } from 'react';
import { IoMdSettings } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Topbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
/*
  // Redirect users based on session state or role
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/'); // Redirect to home if not authenticated
    } else if (session?.user?.role !== 'admin') {
      router.push('/unauthorized'); // Redirect if user is not an admin
    }
  }, [session, status, router]);

  // Show loading state while session is loading
  if (status === 'loading') {
    return <div>Loading...</div>;
  }*/

  return (
    <div className="flex items-center justify-between p-4 text-white bg-[#2B2623]">
      <span>Hi {session?.user?.name}, Welcome Back</span>
      <div className="flex space-x-4">
        {/* Settings Icon */}
        <Link href="/admindashboard/Profile">
          <IoMdSettings />
        </Link>
        {/* Profile Icon */}
        <FaUserAlt />
      </div>
    </div>
  );
};

export default Topbar;
