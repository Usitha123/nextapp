"use client";
import React from 'react';
import { IoMdSettings } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

const Topbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  return (
    <div className="flex items-center justify-between p-4 text-white bg-gray-700">
      <span>Hi <strong>{session?.user?.name}</strong> Welcome Back</span>
      <div className="flex space-x-4">
      <Link href="/Cashierdashboard/Profile">
      <IoMdSettings />
          </Link>
       {/* Settings Icon Placeholder */}
      <FaUserAlt /> {/* Profile Icon Placeholder */}
      </div>
    </div>
  );
};

export default Topbar;
