"use client";

import React, { useState, useEffect } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import UpdateStatusModal from "./Modal";
import DeleteOrder from "./Deleteorder";
import DescriptionModel from "./Descriptionmodel";
import { useSession } from "next-auth/react";

const OrderTable = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ 
    currentPage: 1, 
    rowsPerPage: 9 
  });
  const [modalState, setModalState] = useState({
    isModalOpen: false,
    isDescriptionModelOpen: false,
    isDeleteOrderModalOpen: false,
    selectedDescription: [],
    selectedOrderId: null,
  });
  
  const { data: session, status } = useSession();
  const { currentPage, rowsPerPage } = pagination;

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/vieworders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Status styling helper
  const getStatusClasses = (status) => {
    const statusStyles = {
      "Accepted": "bg-green-500 text-gray-900",
      "Picked": "bg-yellow-500 text-white",
      "Cancelled": "bg-red-500 text-white",
      "Pending": "bg-blue-500 text-white"
    };
    
    return statusStyles[status] || "bg-gray-500 text-white";
  };

  // Date formatting helper
  const formatDate = (dateString) => {
    const createdAt = new Date(dateString);
    return createdAt.toLocaleString();
  };

  // Modal handlers
  const handleDescriptionClick = (orderId) => {
    const selectedOrder = orders.find((order) => order._id === orderId);
    if (selectedOrder) {
      setModalState((prev) => ({
        ...prev,
        selectedDescription: selectedOrder.meals,
        selectedOrderId: orderId,
        isDescriptionModelOpen: true,
      }));
    }
  };

  const openDeleteModal = (orderId) => {
    setModalState((prev) => ({ 
      ...prev, 
      selectedOrderId: orderId, 
      isDeleteOrderModalOpen: true 
    }));
  };

  const openStatusModal = (orderId) => {
    setModalState((prev) => ({ 
      ...prev, 
      selectedOrderId: orderId, 
      isModalOpen: true 
    }));
  };

  const closeModals = (modalType) => {
    setModalState((prev) => ({ 
      ...prev, 
      [modalType]: false 
    }));
  };

  // API interactions
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/deleteorder?id=${modalState.selectedOrderId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setOrders(orders.filter((order) => order._id !== modalState.selectedOrderId));
      } else {
        alert("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("An error occurred while deleting the order");
    } finally {
      closeModals("isDeleteOrderModalOpen");
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const response = await fetch(`/api/updateorderstatus?id=${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update status");
      } else {
        const updatedOrder = await response.json();
        
        // Update local state to avoid refetching
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: status } : order
          )
        );
        
        alert(`Status updated to ${status}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status");
    }
  };

  // Pagination handlers
  const handlePrevPage = () => {
    setPagination((prev) => ({ 
      ...prev, 
      currentPage: Math.max(prev.currentPage - 1, 1) 
    }));
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(filteredOrders.length / rowsPerPage);
    setPagination((prev) => ({ 
      ...prev, 
      currentPage: Math.min(prev.currentPage + 1, maxPage) 
    }));
  };

  // Filter and pagination logic
  const filteredOrders = orders.filter(order => order.orderStatus !== "Pending");
  const indexOfLastOrder = currentPage * rowsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;
  const paginatedOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  // Get current order status
  const getCurrentStatus = () => {
    return orders.find((order) => order._id === modalState.selectedOrderId)?.orderStatus || "";
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg overflow-auto max-h-[80vh]">
      <h2 className="mb-6 text-2xl font-bold text-white">Processed Orders</h2>

      {filteredOrders.length === 0 ? (
        <div className="text-white">No processed orders available</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-gray-900 bg-orange-600">
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="bg-gray-700">
              {paginatedOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-600">
                  <td className="px-4 py-2">{order._id}</td>
                  <td className="px-4 py-2">{order.userName}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded ${getStatusClasses(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {formatDate(order.meals?.[0]?.timestamp || new Date())}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDescriptionClick(order._id)}
                      className="text-orange-400 hover:underline"
                    >
                      View
                    </button>
                  </td>
                  <td className="flex px-4 py-2 space-x-2">
                    <button
                      onClick={() => openDeleteModal(order._id)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="Delete order"
                    >
                      <FaRegTrashAlt />
                    </button>
                    <button
                      onClick={() => openStatusModal(order._id)}
                      className="text-gray-400 hover:text-orange-500"
                      aria-label="Update order status"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 text-white bg-orange-600 rounded disabled:bg-gray-400"
          >
            Prev
          </button>

          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 text-white bg-orange-600 rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      <DescriptionModel
        isOpen={modalState.isDescriptionModelOpen}
        onClose={() => closeModals("isDescriptionModelOpen")}
        description={modalState.selectedDescription}
      />

      <UpdateStatusModal
        isOpen={modalState.isModalOpen}
        onClose={() => closeModals("isModalOpen")}
        onSave={(newStatus) => {
          updateStatus(modalState.selectedOrderId, newStatus);
          closeModals("isModalOpen");
        }}
        currentStatus={getCurrentStatus()}
      />

      <DeleteOrder
        isOpen={modalState.isDeleteOrderModalOpen}
        onClose={() => closeModals("isDeleteOrderModalOpen")}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default OrderTable;