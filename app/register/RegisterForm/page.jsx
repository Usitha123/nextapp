"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../../../src/loginbackground.jpeg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nicNumber, setNicNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [faculty, setFaculty] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !faculty ||
      !phoneNumber ||
      !nicNumber
    ) {
      toast.error("All fields are required.");
      return;
    }

    // Validate phone number is 10 digits
    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error("Phone number must be 10 digits.");
      return;
    }

    // Validate email domain
    if (!/^[a-zA-Z0-9._%+-]+@sjp\.ac\.lk$/.test(email)) {
      toast.error("Email must end with @sjp.ac.lk");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
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
        toast.error("User already exists.");
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          faculty,
          phoneNumber,
          nicNumber,
        }),
      });

      if (res.ok) {
        toast.success("Registration successful!");
        setTimeout(() => {
          e.target.reset();
          router.push("/");
        }, 1000);
      } else {
        toast.error("User registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-lg bg-opacity-90">
        <h2 className="mb-8 text-3xl font-bold text-center text-orange-500">
          Meal Mate
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name fields */}
          <div className="grid grid-cols-2 gap-3">
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
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                className="w-full px-3 py-2 text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
                type="email"
                placeholder="Enter University Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="phoneNumber">
                Phone Number
              </label>
              <input
                className="w-full px-3 py-2 text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                maxLength={10}
              />
            </div>
          </div>

          {/* NIC & Faculty */}
          <div className="grid grid-cols-2 gap-3">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="nicNumber">
                NIC Number
              </label>
              <input
                className="w-full px-3 py-2 text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="NIC Number"
                value={nicNumber}
                onChange={(e) => setNicNumber(e.target.value)}
                required
                maxLength={12}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="faculty">
                Faculty
              </label>
              <select
                className="w-full px-3 py-2 text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                required
              >
                <option value="">Select Faculty</option>
                <option value="Computing">Computing</option>
                <option value="Engineering">Engineering</option>
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
              </select>
            </div>
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-2 gap-3">
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
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-3 py-2 text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              className="px-4 py-2 m-2 font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Register
            </button>
          </div>

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
