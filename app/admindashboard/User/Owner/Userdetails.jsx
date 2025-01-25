import React, { useState, useEffect } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import UpdateStatusModal from "./Modal";
import Deleteowners from "./Deleteowners";
import Link from "next/link";

const ITEMS_PER_PAGE = 4;

const OwnerTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOwnerModalOpen, setIsDeleteOwnerModalOpen] = useState(false);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOwnerId, setSelectedOwnerId] = useState(null);
  const [status, setStatus] = useState("");

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOwners = owners.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Fetch owners data
  const fetchOwners = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/viewownerDetails");
      if (!response.ok) throw new Error("Failed to fetch owner details");
      const data = await response.json();
      setOwners(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  // Pagination handlers
  const handleNext = () => {
    if (currentPage < Math.ceil(owners.length / ITEMS_PER_PAGE)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle delete owner
  const handleDelete = async () => {
    if (!selectedOwnerId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/deleteowner?id=${selectedOwnerId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setOwners(owners.filter((owner) => owner._id !== selectedOwnerId));
        setIsDeleteOwnerModalOpen(false);
      } else {
        alert("Failed to delete owner");
      }
    } catch (error) {
      console.error("Error deleting owner:", error);
      alert("An error occurred while deleting the owner");
    } finally {
      setLoading(false);
    }
  };

  // Update owner status
  const updateStatus = async (ownerId, newStatus) => {
    try {
      const response = await fetch(`/api/updatestatusowner?id=${ownerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update status");
      } else {
        alert(`Status updated to ${newStatus}`);
        fetchOwners(); // Refresh the data
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const createdAt = new Date(dateString);
    return createdAt.toLocaleString();
  };

  return (
    <div className="p-4 text-white bg-gray-800 rounded-lg">
      <div className="flex justify-between mb-4">
        <h2 className="mb-4 text-xl font-semibold">Owners</h2>
        <Link
          href="/admindashboard/User/Owner/Addowners"
          className="px-4 py-2 text-gray-900 bg-orange-500 rounded"
        >
          Add Owner
        </Link>
      </div>

      <table className="w-full text-left text-gray-300">
        <thead>
          <tr className="text-white bg-orange-500">
            <th className="p-2">First Name</th>
            <th className="p-2">Last Name</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Email</th>
            <th className="p-2">NIC</th>
            <th className="p-2">Status</th>
            <th className="p-2">Canteen</th>
            <th className="p-2">Date Registered</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentOwners.map((owner) => (
            <tr key={owner._id} className="border-b border-gray-700">
              <td className="p-2">{owner.firstName}</td>
              <td className="p-2">{owner.lastName}</td>
              <td className="p-2">{owner.phoneNumber}</td>
              <td className="p-2">{owner.email}</td>
              <td className="p-2">{owner.nicNumber}</td>
              <td className="p-2">{owner.status}</td>
              <td className="p-2">{owner.selectcanteen}</td>
              <td className="p-2">{formatDate(owner.createdAt)}</td>
              <td className="flex p-2 space-x-2">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => {
                    setSelectedOwnerId(owner._id);
                    setIsDeleteOwnerModalOpen(true);
                  }}
                >
                  <FaRegTrashAlt />
                </button>
                <button
                  className="text-green-500 hover:text-green-700"
                  onClick={() => {
                    setSelectedOwnerId(owner._id);
                    setIsModalOpen(true);
                  }}
                >
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handlePrev}
          className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={handleNext}
          className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
          disabled={currentPage === Math.ceil(owners.length / ITEMS_PER_PAGE)}
        >
          Next
        </button>
      </div>

      {/* Modals */}
      <UpdateStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newStatus) => {
          updateStatus(selectedOwnerId, newStatus);
          setIsModalOpen(false);
        }}
      />

      <Deleteowners
        isOpen={isDeleteOwnerModalOpen}
        onClose={() => setIsDeleteOwnerModalOpen(false)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default OwnerTable;
