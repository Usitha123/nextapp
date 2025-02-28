"use client";
import React, { useState, useEffect } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import UpdateStatusModal from "./Modal";
import DeleteOrder from "./Deleteorder";
import DescriptionModel from "./Descriptionmodel";
import { useSession } from "next-auth/react";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, rowsPerPage: 9 });
  const [modalState, setModalState] = useState({
    isModalOpen: false,
    isDescriptionModelOpen: false,
    isDeleteOrderModalOpen: false,
    selectedDescription: [],
    selectedOrderId: null,
  });
  const { data: session, status } = useSession();
  const { currentPage, rowsPerPage } = pagination;

  // Fetch orders from API
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

  // Get status classes
  const getStatusClasses = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-500 text-gray-900";
      case "Picked":
        return "bg-yellow-500 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Handle description click
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

  // Handle delete order
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
      setModalState((prev) => ({ ...prev, isDeleteOrderModalOpen: false }));
    }
  };

  // Update order status
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
        alert(`Status updated to ${status}`);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: updatedOrder.orderStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status");
    }
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * rowsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const formatDate = (dateString) => {
    const createdAt = new Date(dateString);
    return createdAt.toLocaleString();
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg overflow-auto max-h-[80vh]">
      <h2 className="mb-6 text-2xl font-bold text-white">Orders</h2>

      {orders.length === 0 ? (
        <div className="text-white">No orders available</div>
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
              {currentOrders.map((order) => (
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
                      onClick={() => {
                        setModalState((prev) => ({ ...prev, selectedOrderId: order._id, isDeleteOrderModalOpen: true }));
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FaRegTrashAlt />
                    </button>
                    <button
                      onClick={() => {
                        setModalState((prev) => ({ ...prev, selectedOrderId: order._id, isModalOpen: true }));
                      }}
                      className="text-gray-400 hover:text-orange-500"
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
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPagination((prev) => ({ ...prev, currentPage: Math.max(prev.currentPage - 1, 1) }))}
          disabled={currentPage === 1}
          className="px-4 py-2 text-white bg-orange-600 rounded disabled:bg-gray-400"
        >
          Prev
        </button>

        <button
          onClick={() => setPagination((prev) => ({ ...prev, currentPage: Math.min(prev.currentPage + 1, Math.ceil(orders.length / rowsPerPage)) }))}
          disabled={currentPage === Math.ceil(orders.length / rowsPerPage)}
          className="px-4 py-2 text-white bg-orange-600 rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>

      {/* Modals */}
      <DescriptionModel
        isOpen={modalState.isDescriptionModelOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isDescriptionModelOpen: false }))}
        description={modalState.selectedDescription}
      />

      <UpdateStatusModal
        isOpen={modalState.isModalOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isModalOpen: false }))}
        onSave={(newStatus) => {
          updateStatus(modalState.selectedOrderId, newStatus);
          setModalState((prev) => ({ ...prev, isModalOpen: false }));
        }}
        currentStatus={orders.find((order) => order._id === modalState.selectedOrderId)?.orderStatus}
      />

      <DeleteOrder
        isOpen={modalState.isDeleteOrderModalOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isDeleteOrderModalOpen: false }))}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default OrderTable;
