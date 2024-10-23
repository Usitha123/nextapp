"use client";

import React from 'react';
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Opencanteen() {
  const { data: session } = useSession();

  return (
    <div>
      <div>
        Name: <span className="font-bold">{`${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`.trim() || 'Guest'}</span>
      </div>
      <div>
        Email: <span className="font-bold">{session?.user?.email}</span>
      </div>
      <button
        onClick={() => signOut()}
        className="px-6 py-2 mt-3 font-bold text-white bg-red-500 rounded"
      >
        Log Out
      </button>
    </div>
  );
}
