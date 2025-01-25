"use client";

import React, { useState, useEffect } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import UpdateStatusModal from "./Modal";
import DeleteOrder from "./Deleteorder";
import DescriptionModel from "./Descriptionmodel";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDescriptionModelOpen, setIsDescriptionModelOpen] = useState(false);
  const [isDeleteOrderModalOpen, setIsDeleteOrderModalOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

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
  }, []);

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
      const mealDescriptions = selectedOrder.meals
        .map((meal) => `${meal.mealName}: ${meal.mealQuantity} x ${meal.mealPrice}`)
        .join(", <br/> ");
      setSelectedDescription(mealDescriptions);
    }
    setSelectedOrderId(orderId);
    setIsDescriptionModelOpen(true);
  };

  const indexOfLastOrder = currentPage * rowsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(orders.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatDate = (dateString) => {
    const createdAt = new Date(dateString);
    return createdAt.toLocaleString();
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-white">Orders</h2>
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
            {currentOrders
              .filter((order) => order.orderStatus !== "Pending")
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
                      onClick={() => setIsDeleteOrderModalOpen(true)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FaRegTrashAlt />
                    </button>
                    <button
                      onClick={() => setIsModalOpen(true)}
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

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 text-white bg-orange-600 rounded disabled:bg-gray-400"
        >
          Prev
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(orders.length / rowsPerPage)}
          className="px-4 py-2 text-white bg-orange-600 rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>

      <UpdateStatusModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <DescriptionModel
        isOpen={isDescriptionModelOpen}
        onClose={() => setIsDescriptionModelOpen(false)}
        description={selectedDescription}
        orderId={selectedOrderId}
      />
      <DeleteOrder isOpen={isDeleteOrderModalOpen} onClose={() => setIsDeleteOrderModalOpen(false)} />
    </div>
  );
};

export default OrderTable;
