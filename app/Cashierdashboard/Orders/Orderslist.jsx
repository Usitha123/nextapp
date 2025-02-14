"use client";
import React, { useState, useEffect } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import UpdateStatusModal from "./Modal";
import DeleteOrder from "./Deleteorder";
import DescriptionModel from "./Descriptionmodel";
import { useSession } from "next-auth/react";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDescriptionModelOpen, setIsDescriptionModelOpen] = useState(false);
  const [isDeleteOrderModalOpen, setIsDeleteOrderModalOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/vieworders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [orders]);

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

  const handleDescriptionClick = (orderId) => {
    const selectedOrder = orders.find((order) => order._id === orderId);
    if (selectedOrder) {
      setSelectedDescription(selectedOrder.meals);
    }
    setSelectedOrderId(orderId);
    setIsDescriptionModelOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/deleteorder?id=${selectedOrderId}`, { method: "DELETE" });
      if (response.ok) {
        setOrders(orders.filter((order) => order._id !== selectedOrderId));
      } else {
        alert("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("An error occurred while deleting the order");
    } finally {
      setLoading(false);
      setIsDeleteOrderModalOpen(false);
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

 /* const indexOfLastOrder = currentPage * rowsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);*/

  const formatDate = (dateString) => {
    const createdAt = new Date(dateString);
    return createdAt.toLocaleString();
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-white">Orders</h2>
      {loading ? (
        <div className="text-white">Loading...</div>
      ) : (
        <>
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
                {orders
                .filter((order) => session?.user?.canteenNamecashier === order.canteenName)
                .map((order) => (
                  <tr key={order._id} className="border-b border-gray-600">
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">{order.userName}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded ${getStatusClasses(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2">{formatDate(order.meals[0].timestamp)}</td>
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
                          setSelectedOrderId(order._id);
                          setIsDeleteOrderModalOpen(true);
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FaRegTrashAlt />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrderId(order._id);
                          setIsModalOpen(true);
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

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-white bg-orange-600 rounded disabled:bg-gray-400"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(orders.length / rowsPerPage)))}
              disabled={currentPage === Math.ceil(orders.length / rowsPerPage)}
              className="px-4 py-2 text-white bg-orange-600 rounded disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Description Modal */}
      <DescriptionModel
        isOpen={isDescriptionModelOpen}
        onClose={() => setIsDescriptionModelOpen(false)}
        description={selectedDescription}
      />

      {/* Edit Status Modal */}
      <UpdateStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newStatus) => {
          updateStatus(selectedOrderId, newStatus);
          setIsModalOpen(false);
        }}
        currentStatus={orders.find((order) => order._id === selectedOrderId)?.orderStatus}
      />

      {/* Delete Confirmation Modal */}
      <DeleteOrder
        isOpen={isDeleteOrderModalOpen}
        onClose={() => setIsDeleteOrderModalOpen(false)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default OrderTable;

