import { useState } from "react";
import { Info } from "lucide-react";
import UpdateStatusModal from "./Deleteorder";
import UpdateDescriptionModal from "./Descriptionmodel"; 

const OrdersTable = ({ ongoingOrders = [], historyOrders = [] }) => {
  const [currentView, setCurrentView] = useState("ongoing"); // 'ongoing' or 'history'
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const orders = currentView === "ongoing" ? ongoingOrders : historyOrders;

  // Helper function to get status-specific styles
  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending":
        return "bg-blue-500 text-white";
      case "Accepted":
        return "bg-yellow-300 text-black";
      case "Ready":
      case "Picked":
        return "bg-green-500 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-200 text-black";
    }
  };

  return (
    <div className="w-full p-5">
      {/* Header with Toggle Buttons */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-2xl ${
              currentView === "ongoing"
                ? "bg-orange-500 text-white"
                : "bg-white text-orange-500 border-2 border-orange-400"
            }`}
            onClick={() => setCurrentView("ongoing")}
          >
            Ongoing
          </button>
          <button
            className={`px-4 py-2 rounded-2xl ${
              currentView === "history"
                ? "bg-orange-500 text-white"
                : "bg-white text-orange-500 border-2 border-orange-400"
            }`}
            onClick={() => setCurrentView("history")}
          >
            History
          </button>
        </div>
      </div>

      {/* Table Content */}
      {orders.length > 0 ? (
        <table className="w-full rounded-2xl p-3 bg-white">
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
            {orders.map((order) => (
              <tr key={order.id} className="text-center">
                <td className="p-2">{order.id}</td>
                {/* Adjusted Status Cell */}
                <td className="p-2">
                  <span
                    className={`inline-block md:w-[50%] w-full h-7/8 px-3 py-2 leading-none ${getStatusStyles(
                      order.status
                    )} rounded-lg`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-2">{order.date}</td>
                <td className="p-2">{order.canteen}</td>
                <td className="p-2">
                  <button
                    onClick={() => setIsDescriptionModalOpen(true)}
                    className="text-blue-500 mx-auto gap-2 flex hover:underline hover:font-bold"
                  >
                    Click <Info className="text-sm" />
                  </button>
                </td>
                <td className="p-2">
                  <div className="flex flex-col md:flex-row gap-2 items-center justify-center">
                    
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="bg-red-500 text-white px-2 py-1 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center">
          {currentView === "ongoing" ? "No ongoing orders." : "No order history."}
        </p>
      )}

      {/* Modals */}
      
      <UpdateDescriptionModal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
      />
      <UpdateStatusModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default OrdersTable;
