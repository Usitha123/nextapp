"use client";

import React, { useState, useEffect } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

import UpdateStatusModal from "./Modal";
import DeleteOrder from "./Deleteorder";
import DescriptionModel from "./Descriptionmodel";

const ROWS_PER_PAGE = 9;

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1 });
  const [modalState, setModalState] = useState({
    isModalOpen: false,
    isDescriptionModelOpen: false,
    isDeleteOrderModalOpen: false,
    selectedDescription: [],
    selectedOrderId: null,
  });

  const { data: session } = useSession();
  const { currentPage } = pagination;

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

  const getStatusClasses = (status) => ({
    Accepted: "inline-block text-white w-[70%] rounded-xl bg-green-500",
    Picked: "inline-block text-black w-[70%] rounded-xl bg-yellow-400",
    Cancelled: "inline-block text-white w-[70%] rounded-xl bg-red-500",
    Ready: "inline-block text-white w-[70%] rounded-xl bg-blue-500",
  }[status] || "bg-gray-500 inline-block w-[70%] rounded-xl text-white");

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const openModal = (type, orderId = null, description = []) =>
    setModalState((prev) => ({
      ...prev,
      [type]: true,
      selectedOrderId: orderId,
      selectedDescription: description,
    }));

  const closeModal = (type) =>
    setModalState((prev) => ({ ...prev, [type]: false }));

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/deleteorder?id=${modalState.selectedOrderId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete order");
      setOrders(orders.filter((o) => o._id !== modalState.selectedOrderId));
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the order");
    } finally {
      closeModal("isDeleteOrderModalOpen");
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
        const err = await res.json();
        throw new Error(err.message || "Failed to update status");
      }
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, orderStatus: status } : o)));
      alert(`Status updated to ${status}`);
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating status");
    }
  };

  const handlePrevPage = () => setPagination((prev) => ({ currentPage: Math.max(prev.currentPage - 1, 1) }));
  const handleNextPage = (maxPage) => setPagination((prev) => ({ currentPage: Math.min(prev.currentPage + 1, maxPage) }));

  // Filter and paginate orders
  const filteredOrders = orders.filter((o) => o.orderStatus !== "Pending" && o.canteenName === session?.user?.canteenNamecashier);
  const totalPages = Math.ceil(filteredOrders.length / ROWS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  const getCurrentStatus = () => orders.find((o) => o._id === modalState.selectedOrderId)?.orderStatus || "";

  return (
    <div className="px-2 overflow-auto max-h-[80vh]">
      {filteredOrders.length === 0 ? (
        <div className="text-white">No processed orders available</div>
      ) : (
        <>
          <div className="overflow-auto justify-center max-w-[75vw] lg:max-w-full rounded-xl">
            <table className="w-full text-sm text-center text-gray-400 rounded-xl bg-[#2B2623]">
              <thead className="text-black bg-orange-500">
                <tr>
                  {["Order ID", "Customer", "Status", "Date", "Payment Method", "Description", "Action"].map((th) => (
                    <th key={th} className="px-4 py-1">{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order._id} className="border-b-2 border-[#3B3737]">
                    <td className="px-4 py-1">{order._id}</td>
                    <td className="px-4 py-1">{order.userName}</td>
                    <td className="px-4 py-1">
                      <span className={`px-2 py-1 rounded ${getStatusClasses(order.orderStatus)}`}>{order.orderStatus}</span>
                    </td>
                    <td className="px-4 py-1">{formatDate(order.meals?.[0]?.timestamp || new Date())}</td>
                    <td className="px-4 py-1">{order.paymentStatus}</td>
                    <td className="px-4 py-1">
                      <button onClick={() => openModal("isDescriptionModelOpen", order._id, order.meals)} className="text-orange-400 hover:underline">
                        View
                      </button>
                    </td>
                    <td className="flex px-4 py-2 space-x-2">
                      <button onClick={() => openModal("isDeleteOrderModalOpen", order._id)} className="text-gray-400 hover:text-red-500" aria-label="Delete order">
                        <FaRegTrashAlt />
                      </button>
                      <button onClick={() => openModal("isModalOpen", order._id)} className="text-gray-400 hover:text-orange-500" aria-label="Update order status">
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-2 mt-2 text-sm">
            <button onClick={handlePrevPage} disabled={currentPage === 1} className="flex items-center gap-0 px-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition">
              <ChevronLeft /> Prev
            </button>
            <span className="text-white">Page {currentPage} of {totalPages}</span>
            <button onClick={() => handleNextPage(totalPages)} disabled={currentPage >= totalPages} className="flex items-center gap-0 px-2 text-sm font-medium bg-[#3B3737] text-orange-500 border border-orange-500 rounded-xl hover:bg-black transition">
              Next <ChevronRight />
            </button>
          </div>
        </>
      )}

      {/* Modals */}
      <DescriptionModel isOpen={modalState.isDescriptionModelOpen} onClose={() => closeModal("isDescriptionModelOpen")} description={modalState.selectedDescription} />
      <UpdateStatusModal
        isOpen={modalState.isModalOpen}
        onClose={() => closeModal("isModalOpen")}
        onSave={(newStatus) => { updateStatus(modalState.selectedOrderId, newStatus); closeModal("isModalOpen"); }}
        currentStatus={getCurrentStatus()}
      />
      <DeleteOrder isOpen={modalState.isDeleteOrderModalOpen} onClose={() => closeModal("isDeleteOrderModalOpen")} onDelete={handleDelete} />
    </div>
  );
};

export default OrderTable;
