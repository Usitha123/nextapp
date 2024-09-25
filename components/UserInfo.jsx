"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session } = useSession();

  return (
    <div className="grid h-screen place-items-center">
      <div className="flex flex-col gap-2 p-8 my-6 shadow-lg bg-zince-300/10">
        <div>
          Name: <span className="font-bold">{session?.user?.name}</span>
        </div>
        <div>
          Email: <span className="font-bold">{session?.user?.email}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="px-6 py-2 mt-3 font-bold bg-red-500 text-whttp://hite"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
