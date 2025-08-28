"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import DescriptionModel from "./Descriptionmodel";
import { ArrowBigUpDash, ChevronLeft, ChevronRight, OctagonAlert, SquareArrowDown } from "lucide-react";

const ROWS_PER_PAGE = 4;

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDescriptionModelOpen, setIsDescriptionModelOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { data: session } = useSession();

  // Get current meal type based on time (match canteen dashboard logic)
  const getCurrentMealType = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 7 && hour < 11) return "Breakfast";
    if (hour >= 11 && hour < 16) return "Lunch";
    if (hour >= 16 && hour < 21) return "Dinner";
    return "Dinner"; // Default fallback
  };

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

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const getStatusClasses = (status) => {
    const statusClasses = {
      Accepted: "text-yellow-400",
      Picked: "text-green-400",
      Cancelled: "text-red-400",
      Pending: "text-blue-400"
    };
    return statusClasses[status] || "bg-gray-500 text-white rounded-xl";
  };

  const handleDescriptionClick = (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (!order) return;

    const mealDescriptions = order.meals
      .map(meal => `${meal.mealName}: ${meal.mealQuantity} x ${meal.mealPrice}`)
      .join(", <br/> ");

    setSelectedDescription(mealDescriptions);
    setSelectedOrderId(orderId);
    setIsDescriptionModelOpen(true);
  };

  const updateStatus = async (orderId, status) => {
    try {
      const response = await fetch(`/api/updateorderstatus?id=${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update status");
      } else {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, orderStatus: status } : order
        ));
        alert(`Status updated to ${status}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status");
    }
  };

  // Derive today's orders for the logged-in cashier's canteen
  const { todayOrders, newOrdersCount, ordersReadyCount, ordersCancelledCount } = useMemo(() => {
    const result = { todayOrders: [], newOrdersCount: 0, ordersReadyCount: 0, ordersCancelledCount: 0 };
    if (!orders || orders.length === 0) return result;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMealType = getCurrentMealType();
    const canteenName = session?.user?.canteenNamecashier;

    const todays = orders
      .filter(order => {
        const orderDate = new Date(order.meals?.[0]?.timestamp);
        return orderDate.toDateString() === today.toDateString();
      })
      .filter(order => order.canteenName === canteenName);

    const newOrders = todays.filter(order => order.orderStatus === "Pending" && order.orderType === currentMealType).length;
    const readyOrders = todays.filter(order => order.orderStatus === "Ready" && order.orderType === currentMealType).length;
    const cancelledOrders = todays.filter(order => order.orderStatus === "Cancelled").length;

    return { todayOrders: todays, newOrdersCount: newOrders, ordersReadyCount: readyOrders, ordersCancelledCount: cancelledOrders };
  }, [orders, session]);

  const stats = [
    { title: "New Orders", value: newOrdersCount, icon: <SquareArrowDown /> },
    { title: "Orders Ready", value: ordersReadyCount, icon: <ArrowBigUpDash /> },
    { title: "Orders Cancelled", value: ordersCancelledCount, icon: <OctagonAlert /> },
  ];

  const handlePagination = (action, totalPages) => {
    if (action === "prev" && currentPage > 1) setCurrentPage(prev => prev - 1);
    if (action === "next" && currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  // Filter orders by Pending status, current meal type, session canteen, and today's date
  const filteredOrders = useMemo(() => {
    const currentMealType = getCurrentMealType();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orders.filter(order => 
      order.orderStatus === "Pending" &&
      order.orderType === currentMealType &&
      session?.user?.canteenNamecashier === order.canteenName &&
      new Date(order.meals?.[0]?.timestamp).toDateString() === today.toDateString()
    );
  }, [orders, session]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ROWS_PER_PAGE));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  if (loading) return <div className="p-6 text-center text-white">Loading orders...</div>;

  return (
    <div className="space-y-2">
      {/* Dashboard Cards Section */}
      <div className="flex flex-wrap justify-center gap-6 rounded-lg xl:gap-16">
        {stats.map(({ title, value, icon }, idx) => (
          <div key={idx} className="relative flex flex-col h-32 w-60 items-center justify-center text-orange-500 bg-[#2B2623] rounded-lg">
            <div className="flex items-center gap-2 text-5xl bg-[#4D423E] px-8 py-4 rounded-lg font-thin">
              <span>{String(value).padStart(2, "0")}</span>
              <span className="absolute top-4 w-[18px] h-[20px] right-4">{icon}</span>
            </div>
            <div className="mt-2 text-gray-300 text-md">{title}</div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="px-6 overflow-auto max-h-[80vh]">
        <h2 className="mx-1 my-2 text-orange-500">Pending Orders</h2>

        {filteredOrders.length === 0 ? (
          <div className="text-white">No pending orders available</div>
        ) : (
          <div className="overflow-auto max-w-[75vw] lg:max-w-full rounded-xl">
            <table className="w-full text-sm text-center text-gray-400 rounded-xl bg-[#2B2623]">
              <thead className="text-black bg-orange-500">
                <tr>
                  <th className="px-4 py-1">Order ID</th>
                  <th className="px-4 py-1">Customer</th>
                  <th className="px-4 py-1">Status</th>
                  <th className="px-4 py-1">Description</th>
                  <th className="px-4 py-1">Date</th>
                  <th className="px-4 py-1">Payment Method</th>
                  <th className="px-4 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map(order => (
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
                    <td className="px-4 py-2">
                      <button onClick={() => handleDescriptionClick(order._id)} className="text-orange-500 hover:underline">
                        View
                      </button>
                    </td>
                    <td className="flex px-4 py-1 space-x-2">
                      <button onClick={() => updateStatus(order._id, "Accepted")} className="flex-1 text-green-400 hover:underline">
                        Accept
                      </button>
                      <button onClick={() => updateStatus(order._id, "Cancelled")} className="flex-1 text-red-400 hover:underline">
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                onClick={() => handlePagination("prev", totalPages)}
                disabled={currentPage === 1}
                className="flex items-center gap-0 px-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
              >
                <ChevronLeft /> Prev
              </button>
              <span className="self-center text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePagination("next", totalPages)}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-0 px-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
              >
                Next <ChevronRight />
              </button>
            </div>
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
