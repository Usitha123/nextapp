"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState(""); // State for first name
  const [lastName, setLastName] = useState("");   // State for last name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!firstName || !lastName || !email || !password || !confirmPassword ) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Check if user already exists
      const resUserExists = await fetch("/api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();
      if (user) {
        setError("User already exists.");
        return;
      }

      // Register the new user
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName, // Send first name
          lastName,  // Send last name
          email,
          password,
        }),
      });

      if (res.ok) {
        e.target.reset(); // Reset form on success
        router.push("/"); // Redirect after successful registration
      } else {
        setError("User registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="grid h-screen place-items-center">
      <div className="p-5 border-t-4 border-green-400 rounded-lg shadow-lg">
        <h1 className="my-4 text-xl font-bold">Register</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="First Name"
            value={firstName} // Use firstName state
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName} // Use lastName state
            onChange={(e) => setLastName(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword} // Update the state for confirm password
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className="px-6 py-2 font-bold text-white bg-green-600">
            Register
          </button>

          {error && (
            <div className="px-3 py-1 mt-2 text-sm text-white bg-red-500 rounded-md">
              {error}
            </div>
          )}

          <Link className="mt-3 text-sm text-right" href={"/"}>
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
