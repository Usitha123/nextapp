"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        return;
      }

      router.replace("dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="flex w-[700px] rounded-lg overflow-hidden bg-gray-300">
        
        {/* Left Side (Image or Placeholder) */}
        <div className="flex items-center justify-center w-1/2 bg-gray-400">
          <div className="w-4/5 bg-gray-200 rounded-md h-4/5"></div>
        </div>

        {/* Right Side (Login Form) */}
        <div className="w-1/2 p-10">
          <h1 className="mb-6 text-3xl font-bold text-center">Welcome To CMS</h1>
           
          <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
            {/* Tab for Login */}
            <div className="flex justify-center mb-4">
              <button className="px-4 py-1 font-semibold text-black rounded-full bg-black/20">Login</button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="mb-4">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
              </div>
              
              <div className="relative mb-6">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
                
              </div>
              
              <button
                type="submit"
                className="w-full p-3 font-semibold text-white bg-black rounded-lg hover:bg-gray-800"
              >
                Login
              </button>

              {/* Register Link */}
            
        
          
            </form>

            
          </div>
          <Link className="mt-3 text-sm text-right" href={"/adminlogin"}>
        <span className="underline">Admin login</span>
          </Link>
          <br/>
          <Link className="mt-3 text-sm text-right" href={"/admindashboard"}>
        <span className="underline">Admin dashboard</span>
          </Link>
          <br/>
          <Link className="mt-3 text-sm text-right" href={"/UserView"}>
        <span className="underline">UserView</span>
          </Link>
          <br/>
          <Link className="mt-3 text-sm text-right" href={"/Canteendashboard"}>
        <span className="underline">Canteendashboard</span>
          </Link>
        </div>
        
      </div>
      
    </div>

  );
}