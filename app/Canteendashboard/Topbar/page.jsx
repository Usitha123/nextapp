"use client"
import React from 'react';
import { IoMdSettings } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Topbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  return (
    <div className="flex items-center justify-between p-4 text-white bg-[#2B2623]">
      <span>Hi {session?.user?.name} {session?.user?.canteenName}, Welcome Back</span>
      <div className="flex space-x-4">
      <Link href="/Canteendashboard/Profile">
      <IoMdSettings />
          </Link>
       {/* Settings Icon Placeholder */}
      <FaUserAlt /> {/* Profile Icon Placeholder */}
      </div>
    </div>
  );
};

export default Topbar;
