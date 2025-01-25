"use client";

import React, { useEffect, useState } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import UpdateStatusModal from "./Cashierstatus";
import Deletecashier from "./Deletecashier";

const ITEMS_PER_PAGE = 4;

const StudentTable = () => {
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteCashierModalOpen, setIsDeleteCashierModalOpen] = useState(false);
  const [selectedCashier, setSelectedCashier] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    const fetchCashiers = async () => {
      try {
        const res = await fetch("/api/allcashierlist");
        if (!res.ok) throw new Error("Failed to fetch cashiers");
        const data = await res.json();
        setCashiers(data);
      } catch (error) {
        console.error("Error fetching cashiers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCashiers();
  }, []);

  const handlePagination = (direction) => {
    const totalPages = Math.ceil(cashiers.length / ITEMS_PER_PAGE);
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const openEditModal = (cashierId) => {
    setSelectedStudentId(cashierId);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (cashier) => {
    setSelectedCashier(cashier);
    setIsDeleteCashierModalOpen(true);
  };

  const closeModals = () => {
    setIsEditModalOpen(false);
    setIsDeleteCashierModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedCashier) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/deletecashier?id=${selectedCashier._id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCashiers(cashiers.filter((cashier) => cashier._id !== selectedCashier._id));
        closeModals();
      } else {
        alert("Failed to delete cashier");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the cashier");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (cashierId, newStatus) => {
    try {
      const response = await fetch(`/api/updatestatuscashier?id=${cashierId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update status");
      } else {
        alert(`Status updated to ${newStatus}`);
        setCashiers((prev) =>
          prev.map((cashier) =>
            cashier._id === cashierId ? { ...cashier, status: newStatus } : cashier
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCashiers = cashiers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-4 text-white bg-gray-800 rounded-lg">
      <h2 className="mb-4 text-xl font-semibold">Cashier List</h2>
      <table className="w-full text-left text-gray-300">
        <thead>
          <tr className="text-white bg-orange-500">
            <th className="p-2">First Name</th>
            <th className="p-2">Last Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone Number</th>
            <th className="p-2">Nic Number</th>
            <th className="p-2">Status</th>
            <th className="p-2">Canteen</th>
            <th className="p-2">Date Registered</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCashiers.map((cashier) => (
            <tr key={cashier._id} className="border-b border-gray-700">
              <td className="p-2">{cashier.firstName}</td>
              <td className="p-2">{cashier.lastName}</td>
              <td className="p-2">{cashier.email}</td>
              <td className="p-2">{cashier.phoneNumber}</td>
              <td className="p-2">{cashier.nicNumber}</td>
              <td className="p-2">{cashier.status}</td>
              <td className="p-2">{cashier.selectCanteen}</td>
              <td className="p-2">{formatDate(cashier.createdAt)}</td>
              <td className="flex p-2 space-x-2">
                <button
                  onClick={() => openDeleteModal(cashier)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaRegTrashAlt />
                </button>
                <button
                  onClick={() => openEditModal(cashier._id)}
                  className="text-blue-500 hover:text-blue-700"
                  aria-label="Edit Cashier"
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
          onClick={() => handlePagination("prev")}
          className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => handlePagination("next")}
          className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
          disabled={currentPage === Math.ceil(cashiers.length / ITEMS_PER_PAGE)}
        >
          Next
        </button>
      </div>
      {/* Modals */}
      <UpdateStatusModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        onSave={(newStatus) => {
          updateStatus(selectedStudentId, newStatus);
          closeModals();
        }}
      />
      <Deletecashier
        isOpen={isDeleteCashierModalOpen}
        onClose={closeModals}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default StudentTable;
