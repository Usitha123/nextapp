"use client";
import { Settings, UserCircle, UserRound } from 'lucide-react';
import React from 'react';
import { useSession } from "next-auth/react";


const Topbar = () => {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between p-4 bg-white">
      <span className='text-lg'>Hi <strong>{session?.user?.firstName}</strong> Welcome Back</span>
      <div className="flex space-x-4">
        <span><UserCircle/></span> {/* Profile Icon Placeholder */}
        <span className='text-[#ff842f]'><Settings/></span> {/* Settings Icon Placeholder */}

      </div>
    </div>
  );
};

export default Topbar;
