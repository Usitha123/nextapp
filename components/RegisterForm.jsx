"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import backgroundImage from "../src/loginbackground.jpeg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const resUserExists = await fetch("/api/userExists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();
      if (user) {
        setError("User already exists.");
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (res.ok) {
        e.target.reset();
        router.push("/");
      } else {
        setError("User registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg bg-opacity-90">
        <h2 className="mb-6 text-2xl font-bold text-center text-orange-500">Jpura CMS</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="firstName">
              First Name
            </label>
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="lastName">
              Last Name
            </label>
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full px-3 py-2 text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="absolute inset-y-0 flex items-center text-gray-600 cursor-pointer right-3"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full px-3 py-2 text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              className="px-4 py-2 font-bold text-white bg-orange-500 rounded hover:bg-orange-600 focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Register
            </button>
          </div>

          {error && <p className="mt-4 text-center text-red-500">{error}</p>}

          <div className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/" className="font-semibold text-orange-500 hover:text-orange-600">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
