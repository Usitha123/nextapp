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
  const [pagination, setPagination] = useState({ currentPage: 1, rowsPerPage: 12 });
  const [modalState, setModalState] = useState({
    isModalOpen: false,
    isDescriptionModelOpen: false,
    isDeleteOrderModalOpen: false,
    selectedDescription: [],
    selectedOrderId: null,
  });

  const { currentPage, rowsPerPage } = pagination;
  const { data: session } = useSession();

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

  const getStatusClasses = (status) => {
    const styles = {
      Accepted: "bg-green-500",
      Picked: "bg-yellow-400",
      Cancelled: "bg-red-500",
      Pending: "bg-gray-500",
    };
    return `block w-auto  md:mx-auto  py-1 text-white  rounded-xl ${styles[status] || "bg-blue-500"}`;
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const openModal = (modalType, orderId) => {
    setModalState((prev) => ({
      ...prev,
      selectedOrderId: orderId,
      [modalType]: true,
    }));
  };

  const closeModals = (modalType) => {
    setModalState((prev) => ({ ...prev, [modalType]: false }));
  };

  const handleDescriptionClick = (orderId) => {
    const selected = orders.find((o) => o._id === orderId);
    if (selected) {
      setModalState((prev) => ({
        ...prev,
        selectedDescription: selected.meals,
        selectedOrderId: selected.orderId,
        isDescriptionModelOpen: true,
      }));
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/deleteorder?id=${modalState.selectedOrderId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o._id !== modalState.selectedOrderId));
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
      const res = await fetch(`/api/updateorderstatus?id=${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update status");
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: status } : order
        )
      );
      alert(`Status updated to ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status");
    }
  };

  const handlePageChange = (direction) => {
    const totalPages = Math.ceil(orders.length / rowsPerPage);
    setPagination((prev) => ({
      ...prev,
      currentPage:
        direction === "prev"
          ? Math.max(prev.currentPage - 1, 1)
          : Math.min(prev.currentPage + 1, totalPages),
    }));
  };

  const paginatedOrders = orders
    .sort((a, b) => new Date(b?.meals?.[0]?.timestamp || 0) - new Date(a?.meals?.[0]?.timestamp || 0))
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalPages = Math.ceil(orders.length / rowsPerPage);
  const getCurrentStatus = () =>
    orders.find((order) => order._id === modalState.selectedOrderId)?.orderStatus || "";

  return (
    <div className="px-2 overflow-auto max-h-[80vh]">
      {orders.length === 0 ? (
        <div className="text-white">No processed orders available</div>
      ) : (
        <div className="overflow-auto justify-center max-w-[75vw] lg:max-w-full rounded-xl">
          <table className="w-full text-sm text-center text-gray-400 rounded-xl bg-[#2B2623]">
            <thead className="text-black bg-orange-500">
              <tr className="px-4 py-1">
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
              {paginatedOrders
                .filter((order) => session?.user?.canteenName === order.canteenName)
                .map((order) => (
                  <tr key={order._id} className="border-b-2 border-[#3B3737]">
                    <td className="px-4 py-1">{order.orderId}</td>
                    <td className="px-4 py-1">{order.userName}</td>
                    <td className="px-4 py-1">
                      <span className={getStatusClasses(order.orderStatus)}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-1">{formatDate(order.meals?.[0]?.timestamp || new Date())}</td>
                    <td className="px-4 py-1">{order.paymentStatus}</td>
                    <td className="px-4 py-1">
                      <button
                        onClick={() => handleDescriptionClick(order._id)}
                        className="text-orange-400 hover:underline"
                      >
                        View
                      </button>
                    </td>
                    <td className="flex px-4 py-2 space-x-2">
                      <button
                        onClick={() => openModal("isDeleteOrderModalOpen", order._id)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Delete order"
                      >
                        <FaRegTrashAlt />
                      </button>
                      <button
                        onClick={() => openModal("isModalOpen", order._id)}
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
      {orders.length > 0 && (
        <div className="flex items-center justify-end gap-2 mt-2 text-sm">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
            className="flex items-center gap-0 px-2 font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
          >
            <ChevronLeft />
            Prev
          </button>
          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange("next")}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-0 px-2 font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
          >
            Next
            <ChevronRight />
          </button>
        </div>
      )}

      {/* Modals */}
      <DescriptionModel
        isOpen={modalState.isDescriptionModelOpen}
        onClose={() => closeModals("isDescriptionModelOpen")}
        description={modalState.selectedDescription}
        orderId={modalState.selectedOrderId}
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
