"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DescriptionModel from "./Descriptionmodel";
import {
  ArrowBigUpDash,
  ChevronLeft,
  ChevronRight,
  OctagonAlert,
  SquareArrowDown,
} from "lucide-react";

const ROWS_PER_PAGE = 7;

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDescriptionModelOpen, setIsDescriptionModelOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { data: session } = useSession();

  const [stats, setStats] = useState([
    { title: "New Orders", value: 0, icon: <SquareArrowDown /> },
    { title: "Orders Ready", value: 0, icon: <ArrowBigUpDash /> },
    { title: "Orders Cancelled", value: 0, icon: <OctagonAlert /> },
  ]);

  // Detect meal type by time
  const getCurrentMealType = () => {
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 11) return "Breakfast";
    if (hour >= 11 && hour < 16) return "Lunch";
    return "Dinner";
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
      calculateStats(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orders) => {
    if (!session?.user?.canteenNamecashier) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMealType = getCurrentMealType();

    const todayOrders = orders.filter((order) => {
      const orderDate = new Date(order.meals[0]?.timestamp);
      return (
        orderDate.toDateString() === today.toDateString() &&
        order.canteenName === session.user.canteenNamecashier
      );
    });

    setStats([
      {
        title: "New Orders",
        value: todayOrders.filter(
          (o) => o.orderStatus === "Pending" && o.orderType === currentMealType
        ).length,
        icon: <SquareArrowDown />,
      },
      {
        title: "Orders Ready",
        value: todayOrders.filter(
          (o) => o.orderStatus === "Ready" && o.orderType === currentMealType
        ).length,
        icon: <ArrowBigUpDash />,
      },
      {
        title: "Orders Cancelled",
        value: todayOrders.filter((o) => o.orderStatus === "Cancelled").length,
        icon: <OctagonAlert />,
      },
    ]);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString();

  const getStatusClasses = (status) => {
    const statusClasses = {
      Accepted: "text-yellow-400",
      Picked: "text-green-400",
      Cancelled: "text-red-400",
      Pending: "text-blue-400",
    };
    return statusClasses[status] || "bg-gray-500 text-white rounded-xl";
  };

  const handleDescriptionClick = (orderId) => {
    const selectedOrder = orders.find((o) => o._id === orderId);
    if (selectedOrder) {
      const mealDescriptions = selectedOrder.meals
        .map(
          (meal) =>
            `${meal.mealName}: ${meal.mealQuantity} x ${meal.mealPrice}`
        )
        .join(", <br/> ");
      setSelectedDescription(mealDescriptions);
      setSelectedOrderId(orderId);
      setIsDescriptionModelOpen(true);
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
      } else {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, orderStatus: status } : o
          )
        );
        alert(`Status updated to ${status}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status");
    }
  };

  const handlePagination = (action) => {
    if (action === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (
      action === "next" &&
      currentPage < Math.ceil(filteredOrders.length / ROWS_PER_PAGE)
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Filter, sort, and paginate
  const filteredOrders = orders
    .filter(
      (o) =>
        o.orderStatus === "Pending" &&
        session?.user?.canteenNamecashier === o.selectCanteen
    )
    .sort(
      (a, b) =>
        new Date(b?.meals?.[0]?.timestamp || 0) -
        new Date(a?.meals?.[0]?.timestamp || 0)
    );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  if (loading) {
    return <div className="p-6 text-center text-white">Loading orders...</div>;
  }

  return (
    <div className="space-y-2">
      {/* Dashboard Cards */}
      <div className="flex flex-wrap justify-center gap-6 xl:gap-16">
        {stats.map(({ title, value, icon }, i) => (
          <div
            key={i}
            className="relative flex flex-col h-32 w-60 items-center justify-center text-orange-500 bg-[#2B2623] rounded-lg"
          >
            <div className="flex items-center gap-2 text-5xl bg-[#4D423E] px-8 py-4 rounded-lg font-thin">
              <span>{String(value).padStart(2, "0")}</span>
              <span className="absolute text-lg top-4 right-4">{icon}</span>
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
                  <th className="px-4 py-1">Date</th>
                  <th className="px-4 py-1">Payment</th>
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
                      <span
                        className={`px-2 py-1 rounded ${getStatusClasses(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-1">
                      {formatDate(order.meals?.[0]?.timestamp || new Date())}
                    </td>
                    <td className="px-4 py-1">{order.paymentStatus}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDescriptionClick(order._id)}
                        className="text-orange-500 hover:underline"
                      >
                        View
                      </button>
                    </td>
                    <td className="px-4 py-1">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateStatus(order._id, "Accepted")}
                          className="flex-1 text-green-400 hover:underline"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(order._id, "Cancelled")}
                          className="flex-1 text-red-400 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              onClick={() => handlePagination("prev")}
              disabled={currentPage === 1}
              className="flex items-center gap-0 px-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
            >
              <ChevronLeft /> Prev
            </button>

            <span className="self-center text-white">
              Page {currentPage} of{" "}
              {Math.max(1, Math.ceil(filteredOrders.length / ROWS_PER_PAGE))}
            </span>

            <button
              onClick={() => handlePagination("next")}
              disabled={currentPage >= Math.ceil(filteredOrders.length / ROWS_PER_PAGE)}
              className="flex items-center gap-0 px-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition"
            >
              Next <ChevronRight />
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
