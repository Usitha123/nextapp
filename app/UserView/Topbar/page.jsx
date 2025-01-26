"use client";
import { Settings, UserCircle, UserRound } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';


const Topbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  /*useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (session?.user?.role !== 'user') {
      router.push('/unauthorized');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }
*/
  return (
    <div className="flex items-center justify-between p-4 bg-white">
      <span className='text-lg'>Hi <strong>{session?.user?.name}, {session?.user?.email} </strong> Welcome Back</span>
      <div className="flex space-x-4">
      <span className='text-[#ff842f]'><Settings/></span> {/* Settings Icon Placeholder */}
      <Link href="/UserView/Profile"><UserCircle/></Link> {/* Profile Icon Placeholder */}
        

      </div>
    </div>
  );
};

export default Topbar;
