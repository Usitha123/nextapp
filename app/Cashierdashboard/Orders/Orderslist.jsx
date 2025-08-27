"use client";

import React, { useState, useEffect } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

import UpdateStatusModal from "./Modal";
import DeleteOrder from "./Deleteorder";
import DescriptionModel from "./Descriptionmodel";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, rowsPerPage: 11 });
  const [modalState, setModalState] = useState({
    isStatusModalOpen: false,
    isDescriptionModalOpen: false,
    isDeleteModalOpen: false,
    selectedDescription: [],
    selectedOrderId: null,
  });

  const { currentPage, rowsPerPage } = pagination;
  const { data: session } = useSession();

  // Fetch orders
  useEffect(() => {
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
    fetchOrders();
  }, []);

  // Helpers
  const getStatusClasses = (status) => {
    const styles = {
      Accepted: "inline-block text-white w-[70%] rounded-xl bg-green-500",
      Picked: "inline-block text-black w-[70%] rounded-xl bg-yellow-400",
      Cancelled: "inline-block text-white w-[70%] rounded-xl bg-red-500",
      Ready: "inline-block text-white w-[70%] rounded-xl bg-blue-500",
    };
    return styles[status] || "inline-block text-white w-[70%] rounded-xl bg-gray-500";
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  // Modal handlers
  const openDescriptionModal = (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    if (order) {
      setModalState((prev) => ({
        ...prev,
        selectedOrderId: orderId,
        selectedDescription: order.meals,
        isDescriptionModalOpen: true,
      }));
    }
  };

  const openDeleteModal = (orderId) => {
    setModalState((prev) => ({
      ...prev,
      selectedOrderId: orderId,
      isDeleteModalOpen: true,
    }));
  };

  const openStatusModal = (orderId) => {
    setModalState((prev) => ({
      ...prev,
      selectedOrderId: orderId,
      isStatusModalOpen: true,
    }));
  };

  const closeModal = (modalName) => {
    setModalState((prev) => ({
      ...prev,
      [modalName]: false,
    }));
  };

  // API actions
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/deleteorder?id=${modalState.selectedOrderId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setOrders((prev) => prev.filter((o) => o._id !== modalState.selectedOrderId));
      } else {
        alert("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("An error occurred while deleting the order");
    } finally {
      closeModal("isDeleteModalOpen");
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
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: status } : o))
        );
        alert(`Status updated to ${status}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status");
    }
  };

  // Pagination
  const filteredOrders = orders.filter(
    (order) => order.orderStatus !== "Pending" && session?.user?.canteenNamecashier === order.selectCanteen
  );

  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b?.meals?.[0]?.timestamp || 0) - new Date(a?.meals?.[0]?.timestamp || 0)
  );

  const indexOfLastOrder = currentPage * rowsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;
  const paginatedOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const handlePrevPage = () =>
    setPagination((prev) => ({ ...prev, currentPage: Math.max(prev.currentPage - 1, 1) }));

  const handleNextPage = () =>
    setPagination((prev) => ({ ...prev, currentPage: Math.min(prev.currentPage + 1, totalPages) }));

  const getCurrentStatus = () =>
    orders.find((o) => o._id === modalState.selectedOrderId)?.orderStatus || "";

  return (
    <div className="px-2 overflow-auto max-h-[80vh]">
      {filteredOrders.length === 0 ? (
        <div className="text-white">No processed orders available</div>
      ) : (
        <div className="overflow-auto justify-center max-w-[75vw] lg:max-w-full rounded-xl">
          <table className="w-full text-sm text-center text-gray-400 rounded-xl bg-[#2B2623]">
            <thead className="text-black bg-orange-500">
              <tr>
                <th className="px-4 py-1">Order ID</th>
                <th className="px-4 py-1">Customer</th>
                <th className="px-4 py-1">Status</th>
                <th className="px-4 py-1">Date</th>
                <th className="px-4 py-1">Payment Method</th>
                <th className="px-4 py-1">Description</th>
                <th className="px-4 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order._id} className="border-b-2 border-[#3B3737]">
                  <td className="px-4 py-1">{order.orderId}</td>
                  <td className="px-4 py-1">{order.userName}</td>
                  <td className="px-4 py-1">
                    <span className={`px-2 py-1 rounded ${getStatusClasses(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-1">{formatDate(order.meals?.[0]?.timestamp || new Date())}</td>
                  <td className="px-4 py-1">{order.paymentStatus}</td>
                  <td className="px-4 py-1">
                    <button
                      onClick={() => openDescriptionModal(order._id)}
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
        <div className="flex items-center justify-end gap-2 mt-2 text-sm">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-0 px-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
          >
            <ChevronLeft /> Prev
          </button>
          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-0 px-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
          >
            Next <ChevronRight />
          </button>
        </div>
      )}

      {/* Modals */}
      <DescriptionModel
        isOpen={modalState.isDescriptionModalOpen}
        onClose={() => closeModal("isDescriptionModalOpen")}
        description={modalState.selectedDescription}
      />
      <UpdateStatusModal
        isOpen={modalState.isStatusModalOpen}
        onClose={() => closeModal("isStatusModalOpen")}
        onSave={(newStatus) => {
          updateStatus(modalState.selectedOrderId, newStatus);
          closeModal("isStatusModalOpen");
        }}
        currentStatus={getCurrentStatus()}
      />
      <DeleteOrder
        isOpen={modalState.isDeleteModalOpen}
        onClose={() => closeModal("isDeleteModalOpen")}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default OrderTable;
