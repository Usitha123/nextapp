"use client"

import React, { useState } from 'react';
import Link from "next/link";
// import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation';


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Initialize the router

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check credentials
    if (email === "admin@gmail.com" && password === "admin") {
      // Navigate to the dashboard route upon successful login
      router.push("/admindashboard"); // Adjust the route as necessary
    } else {
      setError("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="grid h-screen place-items-center">
      <div className="p-5 border-t-4 border-green-400 rounded-lg shadow-lg">
        <h1 className="my-4 text-xl font-bold">Admin Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="px-6 py-2 font-bold text-white bg-green-600 cursor-pointer">
            SUubmit
          </button>
          {error && (
            <div className="px-3 py-1 mt-2 text-sm text-white bg-red-500 rounded-md w-fit">
              {error}
            </div>
          )}
        </form>
        <Link className="mt-3 text-sm text-right" href={"/"}>
          <span className="underline">Home</span>
        </Link>
      </div>
    </div>
  );
}
