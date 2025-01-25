import React, { useState } from "react";
import UpdateStatusModal from "./Modal";

const MainPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-4 text-2xl font-bold">Main Page</h1>
      <p className="mb-8 text-lg">Status: {status || "Not set"}</p>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-400"
      >
        Update Status
      </button>
      <UpdateStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newStatus) => {
          setStatus(newStatus);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default MainPage;
