"use client";
import React, { useState, useEffect } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";


const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
 

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
        return "bg-yellow-500 text-gray-900";
      case "Picked":
        return "bg-green-500 text-white";
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

  const DashboardCards = () => {
    const cards = [
      { title: "New Orders", value: 3, icon: "🔄" },
      { title: "Orders Ready", value: 5, icon: "📦" },
      { title: "Orders Cancelled", value: 2, icon: "⚙️" },
    ];

    return (
      <div className="grid grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="p-4 text-center text-orange-400 bg-gray-700 rounded-lg"
          >
            <div className="mb-2 text-4xl">{String(card.value).padStart(2, "0")}</div>
            <div className="text-sm tracking-wide text-gray-400 uppercase">
              {card.title}
            </div>
            <div className="text-2xl">{card.icon}</div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-white">Dashboard</h2>
        <DashboardCards />
      </div>

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
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-600">
                  <td className="px-4 py-2">{order._id}</td>
                  <td className="px-4 py-2">{order.userName}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded ${getStatusClasses(order.mealStatus)}`}>
                      {order.mealStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
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
      </div>
    </div>
  );
};

export default OrderTable;
