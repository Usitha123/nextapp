import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import Link from "next/link";
import UpdateStatusModal from "./Modal";
import Deleteowners from "./Deleteowners";

const ITEMS_PER_PAGE = 10;

const OwnerTable = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0); // Force re-render trigger

  // Fetch owners data
  const fetchOwners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/alladminlist");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch owners: ${response.status}`);
      }
      
      const data = await response.json();
      setOwners(data);
    } catch (error) {
      console.error("Error fetching owners:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);

  // Memoized calculations
  const totalPages = useMemo(() => 
    Math.ceil(owners.length / ITEMS_PER_PAGE), 
    [owners.length]
  );

  const currentOwners = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return owners.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [owners, currentPage, updateTrigger]); // Add updateTrigger as dependency

  // Pagination handlers
  const handlePagination = useCallback((direction) => {
    setCurrentPage(prev => {
      if (direction === "next" && prev < totalPages) return prev + 1;
      if (direction === "prev" && prev > 1) return prev - 1;
      return prev;
    });
  }, [totalPages]);

  // Modal handlers
  const openEditModal = useCallback((owner) => {
    setSelectedOwner(owner);
    setIsEditModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((owner) => {
    setSelectedOwner(owner);
    setIsDeleteModalOpen(true);
  }, []);

  const closeModals = useCallback(() => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedOwner(null);
  }, []);

  // Delete owner
  const handleDelete = useCallback(async () => {
    if (!selectedOwner?._id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/deleteowner?id=${selectedOwner._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete owner");
      }

      setOwners(prev => prev.filter(owner => owner._id !== selectedOwner._id));
      
      // Adjust current page if necessary
      const newTotalPages = Math.ceil((owners.length - 1) / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      
      closeModals();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message || "An error occurred while deleting the owner");
    } finally {
      setLoading(false);
    }
  }, [selectedOwner, owners.length, currentPage, closeModals]);

  // Update status
  const updateStatus = useCallback(async (newStatus) => {
    if (!selectedOwner?._id) return;

    try {
      setLoading(true);
      
      const response = await fetch(`/api/updatestatusowner?id=${selectedOwner._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      // Update the owners list immediately
      setOwners(prev =>
        prev.map(owner =>
          owner._id === selectedOwner._id 
            ? { ...owner, status: newStatus } 
            : owner
        )
      );

      // Update the selected owner to reflect the change in modals
      setSelectedOwner(prev => prev ? { ...prev, status: newStatus } : null);
      
      // Force re-render to ensure UI updates
      setUpdateTrigger(prev => prev + 1);
      
      alert(`Status updated to ${newStatus}`);
      closeModals();
      
      // Optional: Refetch data to ensure consistency
      // await fetchOwners();
      
    } catch (error) {
      console.error("Status update error:", error);
      alert(error.message || "An error occurred while updating status");
    } finally {
      setLoading(false);
    }
  }, [selectedOwner, closeModals]);

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
  if (loading && owners.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Loading owners...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 text-red-400 rounded-lg bg-red-900/20">
        <p>Error: {error}</p>
        <button 
          onClick={fetchOwners}
          className="px-4 py-2 mt-2 text-white transition bg-red-600 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-200">Admin Management</h2>
          <p className="mt-1 text-sm text-gray-400">
            Manage Admins
          </p>
        </div>
        <Link
          href="/admindashboard/User/Admin/Addadmins"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500/50 rounded-xl hover:bg-black hover:border-orange-500 transition"
        >
          <PlusCircle size={18} />
          Add Admin
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-auto max-w-[75vw] lg:max-w-full rounded-xl">
        <table className="w-full text-sm text-left text-gray-400 rounded-xl bg-[#2B2623]">
          <thead>
            <tr className="text-black bg-orange-500">
              <th className="p-3 font-medium">First Name</th>
              <th className="p-3 font-medium">Last Name</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">NIC</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOwners.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-8 text-center text-gray-500">
                  {owners.length === 0 ? "No owners found" : "No owners on this page"}
                </td>
              </tr>
            ) : (
              currentOwners.map((owner) => (
                <tr key={owner._id} className="border-b border-[#3B3737] hover:bg-[#3B3737]/50 transition">
                  <td className="p-3">{owner.firstName}</td>
                  <td className="p-3">{owner.lastName}</td>
                  <td className="p-3">{owner.phone}</td>
                  <td className="p-3 break-all">{owner.email}</td>
                  <td className="p-3">{owner.nic}</td>
                  <td className="p-3">
                    <span 
                      key={`${owner._id}-${owner.status}-${updateTrigger}`} // Force re-render with key
                      className={`px-2 py-1 rounded-full text-xs transition-colors ${
                        owner.status?.toLowerCase() === 'active' 
                          ? 'bg-green-900/50 text-green-400' 
                          : owner.status?.toLowerCase() === 'pending'
                          ? 'bg-yellow-900/50 text-yellow-400'
                          : 'bg-red-900/50 text-red-400'
                      }`}
                    >
                      {owner.status || 'inactive'}
                    </span>
                  </td>
                  
                  
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(owner)}
                        className="p-1 text-blue-400 transition hover:text-blue-300"
                        aria-label={`Edit ${owner.firstName} ${owner.lastName}`}
                        disabled={loading}
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(owner)}
                        className="p-1 text-red-400 transition hover:text-red-300"
                        aria-label={`Delete ${owner.firstName} ${owner.lastName}`}
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
            Showing {currentOwners.length} of {owners.length} owners
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
        currentStatus={selectedOwner?.status}
      />

      <Deleteowners
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        owner={selectedOwner}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
};

export default OwnerTable;