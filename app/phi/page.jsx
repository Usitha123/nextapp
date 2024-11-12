"use client"
import React, { useState } from "react";
import UpdateStatusModal from "./Modal";

const CashierPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-center h-screen text-white bg-gray-900">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
      >
        Open Modal
      </button>

      <UpdateStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CashierPage;
