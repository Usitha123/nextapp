"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UpdateStatusModal from "./Cashierstatus";
import Deletecashier from "./Deletecashier";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

const CashierTable = () => {
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCashier, setSelectedCashier] = useState(null);
  const [error, setError] = useState(null);

  // Fetch cashiers data
  const fetchCashiers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/allcashierlist");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch cashiers: ${response.status}`);
      }
      
      const data = await response.json();
      setCashiers(data);
    } catch (error) {
      console.error("Error fetching cashiers:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCashiers();
  }, [fetchCashiers]);

  // Memoized calculations
  const totalPages = useMemo(() => 
    Math.ceil(cashiers.length / ITEMS_PER_PAGE), 
    [cashiers.length]
  );

  const currentCashiers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return cashiers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [cashiers, currentPage]);

  // Pagination handlers
  const handlePagination = useCallback((direction) => {
    setCurrentPage(prev => {
      if (direction === "next" && prev < totalPages) return prev + 1;
      if (direction === "prev" && prev > 1) return prev - 1;
      return prev;
    });
  }, [totalPages]);

  // Modal handlers
  const openEditModal = useCallback((cashier) => {
    setSelectedCashier(cashier);
    setIsEditModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((cashier) => {
    setSelectedCashier(cashier);
    setIsDeleteModalOpen(true);
  }, []);

  const closeModals = useCallback(() => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCashier(null);
  }, []);

  // Delete cashier
  const handleDelete = useCallback(async () => {
    if (!selectedCashier?._id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/deletecashier?id=${selectedCashier._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete cashier");
      }

      setCashiers(prev => prev.filter(cashier => cashier._id !== selectedCashier._id));
      
      // Adjust current page if necessary
      const newTotalPages = Math.ceil((cashiers.length - 1) / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      
      closeModals();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message || "An error occurred while deleting the cashier");
    } finally {
      setLoading(false);
    }
  }, [selectedCashier, cashiers.length, currentPage, closeModals]);

  // Update status
  const updateStatus = useCallback(async (newStatus) => {
    if (!selectedCashier?._id) return;

    try {
      const response = await fetch(`/api/updatestatuscashier?id=${selectedCashier._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      setCashiers(prev =>
        prev.map(cashier =>
          cashier._id === selectedCashier._id 
            ? { ...cashier, status: newStatus } 
            : cashier
        )
      );
      
      alert(`Status updated to ${newStatus}`);
      closeModals();
    } catch (error) {
      console.error("Status update error:", error);
      alert(error.message || "An error occurred while updating status");
    }
  }, [selectedCashier, closeModals]);

  // Format date
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Loading state
  if (loading && cashiers.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Loading cashiers...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 text-red-400 rounded-lg bg-red-900/20">
        <p>Error: {error}</p>
        <button 
          onClick={fetchCashiers}
          className="px-4 py-2 mt-2 text-white transition bg-red-600 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    
        
        
      
    <div className="p-4 rounded-lg">
      <Link
          href="/Canteendashboard/Cashier/Addcashier"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
        >
          Add Cashier
          
        </Link>
      {/* Table */}
      <div className="overflow-auto max-w-[75vw] lg:max-w-full rounded-xl">
        <table className="w-full text-sm text-left text-gray-400 rounded-xl bg-[#2B2623]">
          <thead>
            <tr className="text-black bg-orange-500">
              <th className="p-3 font-medium">First Name</th>
              <th className="p-3 font-medium">Last Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">NIC</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Canteen</th>
              <th className="p-3 font-medium">Registered</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCashiers.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-8 text-center text-gray-500">
                  No cashiers found
                </td>
              </tr>
            ) : (
              currentCashiers.map((cashier) => (
                <tr key={cashier._id} className="border-b border-[#3B3737] hover:bg-[#3B3737]/50 transition">
                  <td className="p-3">{cashier.firstName}</td>
                  <td className="p-3">{cashier.lastName}</td>
                  <td className="p-3 break-all">{cashier.email}</td>
                  <td className="p-3">{cashier.phoneNumber}</td>
                  <td className="p-3">{cashier.nicNumber}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      cashier.status === 'active' 
                        ? 'bg-green-900/50 text-green-400' 
                        : 'bg-red-900/50 text-red-400'
                    }`}>
                      {cashier.status}
                    </span>
                  </td>
                  <td className="p-3">{cashier.selectCanteen}</td>
                  <td className="p-3 text-xs">{formatDate(cashier.createdAt)}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(cashier)}
                        className="p-1 text-blue-400 transition hover:text-blue-300"
                        aria-label={`Edit ${cashier.firstName} ${cashier.lastName}`}
                        disabled={loading}
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(cashier)}
                        className="p-1 text-red-400 transition hover:text-red-300"
                        aria-label={`Delete ${cashier.firstName} ${cashier.lastName}`}
                        disabled={loading}
                      >
                        <FaRegTrashAlt size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-400">
            Showing {currentCashiers.length} of {cashiers.length} cashiers
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePagination("prev")}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500/50 rounded-lg hover:bg-black hover:border-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            
            <span className="px-3 py-2 text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => handlePagination("next")}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500/50 rounded-lg hover:bg-black hover:border-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages || loading}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <UpdateStatusModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        onSave={updateStatus}
        currentStatus={selectedCashier?.status}
      />
      
      <Deletecashier
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        cashier={selectedCashier}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
};

export default CashierTable;