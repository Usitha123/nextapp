"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaTrash, FaEdit } from "react-icons/fa";
import Deletecanteens from './Deletecanteens';

const CanteensTable = () => {
  const [isDeleteCanteenModalOpen, setIsDeleteCanteenModalOpen] = useState(false);
  const [canteens, setCanteens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch canteen data
    const fetchCanteens = async () => {
      try {
        const res = await fetch('/api/allcanteenslist');
        const data = await res.json();
        setCanteens(data);
      } catch (error) {
        console.error('Error fetching canteens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCanteens();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
              <th className="px-4 py-2">Canteen Status</th>
              <th className="px-4 py-2">Owner Status</th>
              <th className="px-4 py-2">Opened-Closed Time</th>
              <th className="px-4 py-2">Date Registered</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="bg-gray-700">
            {canteens.map((canteen, index) => (
              <tr key={index} className="border-b border-gray-600">
                <td className="px-4 py-2 text-white">{canteen.canteenName}</td>
                <td className="px-4 py-2">{canteen.businessEmail}</td>
                <td className="px-4 py-2">{canteen.phoneNumber}</td>
                <td className="px-4 py-2">hello</td>
                <td className="px-4 py-2">{canteen.status}</td>
                <td className="px-4 py-2">{canteen.ownerstatus}</td>
                <td className="px-4 py-2">{canteen.openHour} - {canteen.closedHour}</td>
                <td className="px-4 py-2">{new Date(canteen.openingDate).toLocaleDateString()}</td>
                <td className="flex px-4 py-2 space-x-2">
                  <button 
                    onClick={() => setIsDeleteCanteenModalOpen(true)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FaTrash />
                  </button>
                  
                  <Link
          href="/admindashboard/Canteens/UpdateCanteens"
          className="text-gray-400 hover:text-orange-500"
        >
          <FaEdit />
        </Link>

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
      {/* Delete Canteen Modal */}
      <Deletecanteens
        isOpen={isDeleteCanteenModalOpen}
        onClose={() => setIsDeleteCanteenModalOpen(false)}
      />
    </div>
  );
};

export default CanteensTable;
