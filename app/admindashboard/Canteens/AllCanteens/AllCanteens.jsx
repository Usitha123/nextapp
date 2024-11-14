'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaTrash, FaEdit } from "react-icons/fa";
import Deletecanteens from './Deletecanteens';

const CanteensTable = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [canteens, setCanteens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCanteenId, setSelectedCanteenId] = useState(null);

  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        const response = await fetch('/api/allcanteenslist');
        const data = await response.json();
        setCanteens(data);
      } catch (error) {
        console.error('Error fetching canteens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCanteens();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options); // Formats as "Month Day, Year"
  };

  const handleDelete = async () => {
    if (!selectedCanteenId) return;

    try {
      const res = await fetch(`/api/deletecanteen?id=${selectedCanteenId}`, { method: 'DELETE' });
      if (res.ok) {
        setCanteens(canteens.filter(canteen => canteen._id !== selectedCanteenId));
        setIsDeleteModalOpen(false);
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to delete canteen');
      }
    } catch (error) {
      console.error('Error deleting canteen:', error);
      alert('An error occurred while deleting the canteen');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#1b1b1b] p-6 rounded-md shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Canteens</h2>
        <Link href="/admindashboard/Canteens/AddNew" className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-400">
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
              <th className="px-4 py-2">Canteen Status</th>
              <th className="px-4 py-2">Owner Status</th>
              <th className="px-4 py-2">Opened Date</th>
              <th className="px-4 py-2">Opened-Closed</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {canteens.map((canteen) => (
              <tr key={canteen._id} className="border-b border-gray-700">
                <td className="px-4 py-2">{canteen.canteenName}</td>
                <td className="px-4 py-2">{canteen.businessEmail}</td>
                <td className="px-4 py-2">{canteen.phoneNumber}</td>
                <td className="px-4 py-2">{canteen.status}</td>
                <td className="px-4 py-2">{canteen.ownerstatus}</td>
                <td className="px-4 py-2">{formatDate(canteen.openingDate)}</td>
                <td className="px-4 py-2">{canteen.openHour} - {canteen.closedHour}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      setSelectedCanteenId(canteen._id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                  <Link href={`/admindashboard/Canteens/UpdateCanteens?id=${canteen._id}`} className="ml-3 text-blue-500">
                    <FaEdit />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDeleteModalOpen && (
        <Deletecanteens
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default CanteensTable;
