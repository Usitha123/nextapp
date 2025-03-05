"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DescriptionModel from "./Descriptionmodel";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDescriptionModelOpen, setIsDescriptionModelOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { data: session } = useSession();
  
  const ROWS_PER_PAGE = 4;

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
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const createdAt = new Date(dateString);
    return createdAt.toLocaleString();
  };

  const getStatusClasses = (status) => {
    const statusClasses = {
      Accepted: "bg-yellow-500 text-gray-900",
      Picked: "bg-green-500 text-white",
      Cancelled: "bg-red-500 text-white",
      Pending: "bg-blue-500 text-white"
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
      setSelectedOrderId(orderId);
      setIsDescriptionModelOpen(true);
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
        // Update local state to avoid refetching
        setOrders(prevOrders => 
          prevOrders.map(order => 
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

  const stats = [
    { title: "New Orders", value: 3, icon: "🔄" },
    { title: "Orders Ready", value: 5, icon: "📦" },
    { title: "Orders Cancelled", value: 2, icon: "⚙️" },
  ];

  const handlePagination = (action) => {
    if (action === "prev" && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else if (action === "next" && currentPage < Math.ceil(filteredOrders.length / ROWS_PER_PAGE)) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Filter pending orders
  const filteredOrders = orders.filter(order => order.orderStatus === "Pending");
  
  // Calculate pagination
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ROWS_PER_PAGE, 
    currentPage * ROWS_PER_PAGE
  );

  if (loading) {
    return <div className="p-6 text-center text-white">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
    {/* Dashboard Cards Section */}
    <div className="p-6 rounded-lg ">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ title, value, icon }, index) => (
          <div key={index} className="relative flex flex-col h-32 w-60 items-center justify-center p-2 text-orange-500 bg-[#2B2623] rounded-lg">
            <div className="flex items-center gap-2 text-5xl bg-[#4D423E] px-8 py-4 rounded-lg font-thin">
              <span>{String(value).padStart(2, "0")}</span>
              <span className="absolute top-4 w-[18px] h-[20px] right-4 text-[2px]">{icon}</span>
            </div>
            <div className="mt-2 text-gray-300 text-md">{title}</div>
          </div>
        ))}
      </div>
    </div>
  

      {/* Orders Table */}
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg overflow-auto max-h-[80vh]">
        <h2 className="mb-6 text-2xl font-bold text-white">Pending Orders</h2>

        {filteredOrders.length === 0 ? (
          <div className="text-white">No pending orders available</div>
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
                        onClick={() => updateStatus(order._id, "Accepted")} 
                        className="text-green-400 hover:underline"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => updateStatus(order._id, "Cancelled")} 
                        className="text-red-400 hover:underline"
                      >
                        Cancel
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
          <div className="flex justify-between mt-4">
            <button
              onClick={() => handlePagination("prev")}
              disabled={currentPage === 1}
              className="px-4 py-2 text-white bg-orange-600 rounded disabled:bg-gray-400"
            >
              Prev
            </button>
            
            <span className="self-center text-white">
              Page {currentPage} of {Math.max(1, Math.ceil(filteredOrders.length / ROWS_PER_PAGE))}
            </span>

            <button
              onClick={() => handlePagination("next")}
              disabled={currentPage >= Math.ceil(filteredOrders.length / ROWS_PER_PAGE)}
              className="px-4 py-2 text-white bg-orange-600 rounded disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Description Modal */}
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