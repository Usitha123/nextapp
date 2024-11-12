"use client";
import React, { useState } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import UpdateStatusModal from "./Modal";
import Deleteorder from "./Deleteorder";
import Descriptionmodel from "./Descriptionmodel"; // Assuming this exists

const OrderTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDescriptionModelOpen, setIsDescriptionModelOpen] = useState(false);
  const [isDeleteOrderModalOpen, setIsDeleteOrderModalOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  const orders = [
    { id: "#od1234", customer: "Usitha", status: "Accepted", date: "12/07/24", description: "Order details for Usitha" },
    { id: "#od1235", customer: "Srimal", status: "Accepted", date: "12/07/24", description: "Order details for Srimal" },
    { id: "#od1236", customer: "Akila", status: "Picked", date: "12/07/24", description: "Order details for Akila" },
    { id: "#od1237", customer: "Akila", status: "Cancelled", date: "12/07/24", description: "Cancellation details for Akila" },
  ];

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

  const handleDescriptionClick = (description) => {
    setSelectedDescription(description);
    setIsDescriptionModelOpen(true);
  };

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
            {orders.map((order, index) => (
              <tr key={index} className="border-b border-gray-600">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.customer}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded ${getStatusClasses(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2">{order.date}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDescriptionClick(order.description)}
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

      {/* Update Status Modal */}
      <UpdateStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Description Modal */}
      <Descriptionmodel
        isOpen={isDescriptionModelOpen}
        onClose={() => setIsDescriptionModelOpen(false)}
        description={selectedDescription}
      />

      {/* Delete Order Modal */}
      <Deleteorder
        isOpen={isDeleteOrderModalOpen}
        onClose={() => setIsDeleteOrderModalOpen(false)}
      />
    </div>
  );
};

export default OrderTable;
