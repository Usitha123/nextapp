"use client";

import React, { useState, useEffect } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import DescriptionModel from "./Descriptionmodel";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDescriptionModelOpen, setIsDescriptionModelOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const ordersPerPage = 8;

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
    const statusClasses = {
      Accepted: "bg-yellow-500 text-gray-900",
      Picked: "bg-green-500 text-white",
      Cancelled: "bg-red-500 text-white",
    };
    return statusClasses[status] || "bg-gray-500 text-white";
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

  const DashboardCards = () => {
    const cards = [
      { title: "New Orders", value: 3, icon: "🔄" },
      { title: "Orders Ready", value: 5, icon: "📦" },
      { title: "Orders Cancelled", value: 2, icon: "⚙️" },
    ];

    return (
      <div className="grid grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <div key={index} className="p-4 text-center text-orange-400 bg-gray-700 rounded-lg">
            <div className="mb-2 text-4xl">{String(card.value).padStart(2, "0")}</div>
            <div className="text-sm tracking-wide text-gray-400 uppercase">{card.title}</div>
            <div className="text-2xl">{card.icon}</div>
          </div>
        ))}
      </div>
    );
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePagination = (direction) => {
    if (direction === "next" && currentPage < Math.ceil(orders.length / ordersPerPage)) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatDate = (dateString) => {
    const createdAt = new Date(dateString);
    return createdAt.toLocaleString();
  };

  const updateStatus = async (orderId, status) => { // Added status parameter
    try {
      const response = await fetch(`/api/updateorderstatus?id=${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status }), // Use the passed status
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update status");
      } else {
        const updatedOrder = await response.json(); // Get the updated order from response
        alert(`Status updated to ${status}`);
        
      
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status");
    }
  };
  
  

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-white">Dashboard</h2>
        <DashboardCards />
      </div>

      <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-white">Pending Orders</h2>
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
                .filter((order) => order.orderStatus === "Pending")
                .map((order) => (
                  <tr key={order._id} className="border-b border-gray-600">
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">{order.userName}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded ${getStatusClasses(order.mealStatus)}`}>
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
                        onClick={() => updateStatus(order._id, "Active")}
                        className="text-green-400 hover:underline"
                      >
                        Accept
                      </button>
                      <button 
                       onClick={() => updateStatus(order._id, "Cancelled")}
                       className="text-red-400 hover:underline">Cancel</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => handlePagination("prev")}
            disabled={currentPage === 1}
            className="px-4 py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            Previous
          </button>
          <button
            onClick={() => handlePagination("next")}
            disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}
            className="px-4 py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>

      <DescriptionModel
        isOpen={isDescriptionModelOpen}
        onClose={() => setIsDescriptionModelOpen(false)}
        description={selectedDescription}
        orderId={selectedOrderId}
      />
    </div>
  );
};

export default OrderTable;
