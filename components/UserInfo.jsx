"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function UserInfo() {
  const { data: session } = useSession();

  return (
    <div>
      <div className="grid h-screen place-items-center">
        <div className="flex flex-col gap-2 p-8 my-6 shadow-lg bg-zinc-300/10">
          <div>
            Name: <span className="font-bold">{session?.user?.name}</span>
          </div>
          <div>
            Email: <span className="font-bold">{session?.user?.email}</span>
          </div>
          <button
            onClick={() => signOut()}
            className="px-6 py-2 mt-3 font-bold text-white bg-red-500"
          >
            Log Out
          </button>
        </div>

        <div>
          <header className="p-4 bg-gray-100">
            <div className="container flex items-center justify-between mx-auto">
              <Link href="#" className="text-xl font-bold">LOGO</Link>
              <nav>
                <ul className="flex space-x-4">
                  <li><Link href="#" className="hover:text-gray-600">Home</Link></li>
                  <li><Link href="#" className="hover:text-gray-600">Canteens</Link></li>
                  <li><Link href="#" className="hover:text-gray-600">About</Link></li>
                  <li><Link href="#" className="hover:text-gray-600">Orders</Link></li>
                  <li><Link href="#" className="hover:text-gray-600">Cart</Link></li>
                  {session ? (
                    <li><Link href="#" className="hover:text-gray-600">Profile</Link></li>
                  ) : (
                    <li><Link href="#" className="hover:text-gray-600">Login</Link></li>
                  )}
                </ul>
              </nav>
            </div>
          </header>

          <main className="container py-8 mx-auto">
            <h1 className="mb-4 text-3xl font-bold text-center">Welcome To CMS</h1>
            <h2 className="mb-6 text-2xl font-semibold text-center">Select Your Favorite Dish</h2>

            <div className="flex justify-center mb-8">
              <button className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">Explore</button>
              <button className="px-4 py-2 text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400">Proceed</button>
            </div>

            <section className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-center">Canteens</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <h4 className="mb-2 text-lg font-medium">Canteen 1</h4>
                  <p className="text-gray-600">Description</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-center">About</h3>
              <p className="text-center text-gray-600">Our CMS is a one-stop solution for students to conveniently select and order from various canteens, streamlining the dining experience for all.</p>
            </section>

            <section className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-center">Contact</h3>
              <p className="text-center text-gray-600">Contact Administration if you face any problem with the food bar</p>
              <div className="flex justify-center mt-4">
                <button className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">Get In Touch</button>
                <button className="px-4 py-2 text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400">Email Us</button>
              </div>
            </section>
          </main>

          <footer className="py-4 text-center bg-gray-100">
            <p>&copy; 2023 CMS</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
