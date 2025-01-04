import { useState } from "react";
import { Info } from "lucide-react";
import { usePathname } from "next/navigation"; 
import Link from "next/link";
import UpdateStatusModal from "./Deleteorder";
import UpdateDescriptionModal from "./Descriptionmodel";

const OrdersTable = ({ ongoingOrders = [], historyOrders = [] }) => {
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const pathname = usePathname(); 

  const getStatusStyles = (status) => {
    const statusStyles = {
      Pending: "bg-blue-500 text-white",
      Accepted: "bg-yellow-300 text-black",
      Ready: "bg-green-500 text-white",
      Picked: "bg-green-500 text-white",
      Cancelled: "bg-red-500 text-white",
    };
    return statusStyles[status] || "bg-gray-200 text-black";
  };

  const renderTable = (orders) => (
    <table className="w-full p-3 bg-white rounded-2xl">
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
            <td className="p-2">
              <span
                className={`inline-block md:w-[50%] w-full h-7/8 px-3 py-2 leading-none ${getStatusStyles(order.status)} rounded-lg`}
              >
                {order.status}
              </span>
            </td>
            <td className="p-2">{order.date}</td>
            <td className="p-2">{order.canteen}</td>
            <td className="p-2">
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setIsDescriptionModalOpen(true);
                }}
                className="flex gap-2 mx-auto text-blue-500 hover:underline hover:font-bold"
              >
                Click <Info className="text-sm" />
              </button>
            </td>
            <td className="p-2">
              <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsDeleteModalOpen(true);
                  }}
                  className="px-2 py-1 text-white bg-red-500 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Sample data
  const sampleOrders = [
    { id: "001", status: "Pending", date: "2025-01-01", canteen: "North Canteen" },
    { id: "002", status: "Accepted", date: "2025-01-02", canteen: "South Canteen" },
    { id: "003", status: "Ready", date: "2025-01-03", canteen: "East Canteen" },
    { id: "004", status: "Picked", date: "2025-01-04", canteen: "West Canteen" },
    { id: "005", status: "Cancelled", date: "2025-01-05", canteen: "Main Canteen" },
  ];

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

      {sampleOrders.length > 0
        ? renderTable(sampleOrders)
        : <p>No orders available</p>}

      <UpdateDescriptionModal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        order={selectedOrder}
      />
      <UpdateStatusModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrdersTable;
