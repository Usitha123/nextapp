"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../src/loginbackground.jpeg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      // Get the updated session and redirect based on role
      const response = await fetch("/api/auth/session");
      const session = await response.json();

      switch (session?.user?.role) {
        case "admin":
          router.push("/admindashboard");
          break;
        case "canteenOwner":
          router.push("/Canteendashboard");
          break;
        case "user":
          router.push("/UserView");
          break;
        case "cashier":
          router.push("/Cashierdashboard");
          break;
        default:
          setError("Unknown user role");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
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
        closeOnClick
        draggable
        pauseOnHover
      />
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg bg-opacity-90">
        <h2 className="mb-6 text-2xl font-bold text-center text-orange-500">Jpura CMS</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
              id="email"
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

          <div className="flex items-center justify-center mb-4">
            <button
              className="px-4 py-2 font-bold text-white bg-orange-500 rounded hover:bg-orange-600 focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
          </div>

          {error && <p className="mt-4 text-center text-red-500">{error}</p>}

          <div className="mt-4 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
          
<Link href="/register" className="font-semibold text-orange-500 cursor-pointer hover:text-orange-600">
  Register
</Link>
            
          </div>

          
        </form>
      </div>
    </div>
  );
}
