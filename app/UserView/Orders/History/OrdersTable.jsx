"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import UpdateStatusModal from "./Deleteorder";
import DescriptionModal from "./Descriptionmodel";
import { ChevronLeft, ChevronRight } from "lucide-react";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    rowsPerPage: 5, // match ongoing table
  });

  const { data: session } = useSession();
  const pathname = usePathname();
  const { currentPage, rowsPerPage } = pagination;

  useEffect(() => {
    fetchOrders();
  }, [refreshTrigger]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/vieworders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders || data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClasses = (status) => {
    const statusStyles = {
      Accepted: "inline-block text-white w-[70%] rounded-xl bg-green-500",
      Picked: "inline-block text-black w-[70%] rounded-xl bg-yellow-400",
      Cancelled: "inline-block text-white w-[70%] rounded-xl bg-red-500",
      Ready: "inline-block text-white w-[70%] rounded-xl bg-blue-500",
      Drop: "inline-block text-white w-[70%] rounded-xl bg-gray-500",
    };
    return (
      statusStyles[status] ||
      "bg-gray-400 text-white rounded-xl w-[70%] inline-block"
    );
  };

  const formatDate = (dateString) => {
    try {
      const createdAt = new Date(dateString);
      return createdAt.toLocaleString();
    } catch {
      return "Invalid date";
    }
  };

  const handleDescriptionClick = (orderId) => {
    const order = orders.find((order) => order._id === orderId);
    if (order) {
      const mealDescriptions = order.meals
        .map(
          (meal) => `${meal.mealName}: ${meal.mealQuantity} x ${meal.mealPrice}`
        )
        .join(", <br/> ");
      setSelectedDescription(mealDescriptions);
      setSelectedOrderId(orderId);
      setIsDescriptionModalOpen(true);
    }
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const closeDescriptionModal = () => setIsDescriptionModalOpen(false);

  const handleConfirmCancel = async () => {
    if (selectedOrder?._id) {
      await updateStatus(selectedOrder._id, "Drop");
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
        return;
      }

      alert(`Status updated to ${status}`);
      setRefreshTrigger((prev) => prev + 1);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status");
    }
  };

  const getFilteredOrders = () => {
    if (!orders || !orders.length || !session?.user?.email) return [];

    return orders
      .filter((order) => session.user.email === order.userEmail)
      .filter(
        (order) =>
          Array.isArray(order.meals) &&
          order.meals.length > 0 &&
          ["Cancelled", "Picked"].includes(order.orderStatus)
      );
  };

  // ✅ PAGINATION LOGIC
  const filteredOrders = getFilteredOrders();
  const indexOfLastOrder = currentPage * rowsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;
  const paginatedOrders = filteredOrders
    .slice()
    .sort((a, b) => {
      const timeA = a.meals?.[0]?.timestamp
        ? new Date(a.meals[0].timestamp)
        : new Date(0);
      const timeB = b.meals?.[0]?.timestamp
        ? new Date(b.meals[0].timestamp)
        : new Date(0);
      return timeB - timeA;
    })
    .slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const handlePrevPage = () => {
    setPagination((prev) => ({
      ...prev,
      currentPage: Math.max(prev.currentPage - 1, 1),
    }));
  };

  const handleNextPage = () => {
    setPagination((prev) => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, totalPages),
    }));
  };

  const renderOrdersTable = () => {
    if (filteredOrders.length === 0) {
      return <p>No past orders available</p>;
    }

    return (
      <div className="overflow-auto justify-center min-w-[0px] max-w-[75vw] lg:max-w-full rounded-xl">
        <table className="w-full text-sm bg-white rounded-2xl">
          <thead>
            <tr className="text-white bg-orange-500 rounded">
              <th className="p-2 rounded-tl-2xl">Order ID</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
              <th className="p-2">Canteen</th>
              <th className="p-2">Description</th>
              <th className="p-2 rounded-tr-2xl">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr key={order._id} className="text-center">
                <td className="p-2">{order._id}</td>
                <td className="p-2">
                  <span
                    className={`block w-auto md:w-[70%] md:mx-auto px-3 py-2 leading-none text-center ${getStatusClasses(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="p-2">
                  {order.meals?.[0]?.timestamp
                    ? formatDate(order.meals[0].timestamp)
                    : "N/A"}
                </td>
                <td className="p-2">{order.canteenName || "N/A"}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDescriptionClick(order._id)}
                    className="text-orange-400 hover:underline"
                  >
                    View
                  </button>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleCancelClick(order)}
                    className="block w-auto md:w-[70%] md:mx-auto px-3 py-2 leading-none text-white rounded-xl bg-red-500 opacity-50"
                  >
                    Clear
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-end gap-2 mt-2 text-sm">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-2 py-1 text-sm font-medium bg-white text-orange-500 border border-orange-500 rounded-xl hover:bg-gray-100 transition disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Prev
            </button>

            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 px-2 py-1 text-sm font-medium bg-white text-orange-500 border border-orange-500 rounded-xl hover:bg-gray-100 transition disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4">
          <Link
            href="/UserView/Orders/Ongoing"
            className={`text-orange-500 hover:underline ${
              pathname === "/UserView/Orders/Ongoing" ? "font-bold" : ""
            }`}
          >
            Ongoing
          </Link>
          <Link
            href="/UserView/Orders/History"
            className={`text-orange-500 hover:underline ${
              pathname === "/UserView/Orders/History" ? "font-bold" : ""
            }`}
          >
            History
          </Link>
        </div>
      </div>

      {loading ? <p>Loading orders...</p> : renderOrdersTable()}

      <DescriptionModal
        isOpen={isDescriptionModalOpen}
        onClose={closeDescriptionModal}
        description={selectedDescription}
        orderId={selectedOrderId}
      />

      <UpdateStatusModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
};

export default OrdersTable;
