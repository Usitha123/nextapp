"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import backgroundImage from "../src/loginbackground.jpeg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
    <div
      className="relative flex items-center justify-center h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      {/* Dark shadow overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      <div className="relative z-10 w-full max-w-sm p-8 bg-white rounded-lg shadow-2xl bg-opacity-80">
        <h2 className="mb-6 text-2xl font-bold text-center text-orange-400">Jpura CMS</h2>

        <h4 className="mb-6 text-xl font-semibold text-orange-400">Admin Login</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-white-200" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border rounded shadow text-white-300 bg-white-700 border-white-600 focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-white-200" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full px-3 py-2 border rounded shadow bg-white-700 border-white-600 text-white-300 focus:outline-none focus:shadow-outline"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="absolute inset-y-0 flex items-center cursor-pointer text-white-400 right-3"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEye /> :  <FaEyeSlash />}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              className="px-4 py-2 font-bold text-white bg-orange-500 rounded hover:bg-orange-600 focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          {error && <p className="mt-4 text-center text-red-500">{error}</p>}

          <div className="mt-4 text-center">
            <Link href="/" className="font-semibold text-orange-400 hover:text-orange-500">
              Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
