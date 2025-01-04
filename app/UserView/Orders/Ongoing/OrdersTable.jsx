import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import UpdateStatusModal from "./Deleteorder";
import UpdateDescriptionModal from "./Descriptionmodel";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const statusStyles = {
    Pending: "bg-blue-500 text-white",
    Accepted: "bg-yellow-300 text-black",
    Ready: "bg-green-500 text-white",
    Picked: "bg-green-500 text-white",
    Cancelled: "bg-red-500 text-white",
  };

  const getStatusStyles = (mealStatus) => statusStyles[mealStatus] || "bg-gray-200 text-black";

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/vieworders");
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      console.log("Fetched orders:", data);

      setOrders(data.orders || data); // Handle both object and array responses
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today's time to midnight
    return today;
  };

  const formatDate = (dateString) => {
    const createdAt = new Date(dateString);
    return createdAt.toLocaleString();
  };


  const renderTable = (orders) => {
    const today = getTodayDate();

    return (
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
          {orders
            .filter((order) => {
              const orderDate = new Date(order.meals[0].timestamp);
              orderDate.setHours(0, 0, 0, 0); // Remove the time part of the order's timestamp
              return orderDate.getTime() === today.getTime(); // Compare only the date part
            })
            .filter((order) => ["Pending", "Ready"].includes(order.mealStatus)) // Filter by relevant statuses
            .map((order) => (
              <tr key={order._id} className="text-center">
                <td className="p-2">{order._id}</td>
                <td className="p-2">
                  <span className={`inline-block  w-full h-7/8 px-4 py-2 leading-none ${getStatusStyles(order.mealStatus)} rounded-lg`}>
                    {order.mealStatus}
                  </span>
                </td>
                <td className="p-2">{formatDate(order.meals[0].timestamp)}</td>
                <td className="p-2">{order.canteenName}</td>
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
  };

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4">
          <Link
            href="/UserView/Orders/Ongoing"
            className={`text-orange-500 hover:underline ${pathname === "/UserView/Orders/Ongoing" ? "font-bold" : ""}`}
          >
            Ongoing
          </Link>
          <Link
            href="/UserView/Orders/History"
            className={`text-orange-500 hover:underline ${pathname === "/UserView/Orders/History" ? "font-bold" : ""}`}
          >
            History
          </Link>
        </div>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length > 0 ? (
        renderTable(orders)
      ) : (
        <p>No orders available</p>
      )}

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
