"use client";

import React from "react";
import Link from "next/link"; // Ensure you import Link from "next/link"
import { FaTrash, FaEdit } from "react-icons/fa";

const CanteensTable = () => {
  const canteens = [
    {
      name: "SkyCafe Canteen",
      email: "skycafe@gmail.com",
      phone: "0112596347",
      owner: "Usitha",
      openedTime: "7.00 AM - 9.00 PM",
      dateRegistered: "20/03/2021",
    },
    {
      name: "Open Canteen",
      email: "skycafe@gmail.com",
      phone: "0112596347",
      owner: "Srimal",
      openedTime: "7.00 AM - 9.00 PM",
      dateRegistered: "20/03/2021",
    },
    {
      name: "Rahula Canteen",
      email: "skycafe@gmail.com",
      phone: "0112596347",
      owner: "Akila",
      openedTime: "7.00 AM - 9.00 PM",
      dateRegistered: "20/03/2021",
    },
    {
      name: "Gym Canteen",
      email: "skycafe@gmail.com",
      phone: "0112596347",
      owner: "Kavindu",
      openedTime: "7.00 AM - 9.00 PM",
      dateRegistered: "20/03/2021",
    },
  ];

  return (
    <div className="bg-[#1b1b1b] p-6 rounded-md shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Canteens</h2>
        <Link
          href="/admindashboard/Canteens/AddNew"
          className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-400"
        >
          Add Canteen
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-gray-900 bg-orange-600">
            <tr>
              <th className="px-4 py-2">Canteen</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Owner</th>
              <th className="px-4 py-2">Opened Time</th>
              <th className="px-4 py-2">Date Registered</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="bg-gray-700">
            {canteens.map((canteen, index) => (
              <tr key={index} className="border-b border-gray-600">
                <td className="px-4 py-2 text-white">{canteen.name}</td>
                <td className="px-4 py-2">{canteen.email}</td>
                <td className="px-4 py-2">{canteen.phone}</td>
                <td className="px-4 py-2">{canteen.owner}</td>
                <td className="px-4 py-2">{canteen.openedTime}</td>
                <td className="px-4 py-2">{canteen.dateRegistered}</td>
                <td className="flex px-4 py-2 space-x-2">
                  <button className="text-gray-400 hover:text-red-500">
                    <FaTrash />
                  </button>
                  <button className="text-gray-400 hover:text-orange-500">
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4 text-gray-400">
        <button className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500">
          Prev
        </button>
        <button className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500">
          Next
        </button>
      </div>
    </div>
  );
};

export default CanteensTable;
