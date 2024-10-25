"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Set loading to true

    try {
      const response = await fetch('/api/auth/adminauth', { // Ensure the API route is correct
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // If the login is successful, navigate to the admin dashboard
        router.push("/admindashboard");
      } else {
        const data = await response.json();
        setError(data.message || "Invalid credentials, please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="grid h-screen place-items-center">
      <div className="p-5 border-t-4 border-green-400 rounded-lg shadow-lg">
        <h1 className="my-4 text-xl font-bold">Admin Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label>
            <span className="sr-only">Email</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border rounded"
            />
          </label>
          <label>
            <span className="sr-only">Password</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2 border rounded"
            />
          </label>
          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className={`px-6 py-2 font-bold text-white ${loading ? 'bg-gray-400' : 'bg-green-600'} cursor-pointer`}
          >
            {loading ? 'Logging in...' : 'Submit'}
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
