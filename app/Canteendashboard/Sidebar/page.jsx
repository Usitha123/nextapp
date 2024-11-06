import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

const Sidebar = () => {
  const router = useRouter(); // Get the router instance

  // Optional: Function to handle navigation if needed
  const handleNavigation = (path) => {
    router.push(path); // Navigate to the specified path
  };

  return (
    <div className="w-64 h-screen p-4 text-white bg-gray-800">
      <h1 className="mb-6 text-2xl font-bold text-orange-500">LOGO</h1>
      <ul className="space-y-4">
        <li>
          <Link href="/canteendashboard/Dashboard" className="block p-2 rounded hover:bg-gray-700">
            Canteen Dashboard
          </Link>
        </li>
        {/* Example of using handleNavigation */}
        <li>
          <button
            onClick={() => handleNavigation('/canteendashboard/anotherPage')}
            className="block w-full p-2 text-left text-white rounded hover:bg-gray-700"
          >
            Another Page
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
