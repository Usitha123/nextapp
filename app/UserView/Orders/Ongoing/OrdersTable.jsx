import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import UpdateStatusModal from "./Deleteorder";
import DescriptionModel from "./DescriptionModel";


const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

  const pathname = usePathname();

  const statusStyles = {
    Pending: "bg-blue-500 text-white",
    Accepted: "bg-yellow-300 text-black",
    Ready: "bg-green-500 text-white",
    Picked: "bg-green-500 text-white",
    Cancelled: "bg-red-500 text-white",
  };

  const fetchOrders = async () => {
    try {
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const handleDescriptionClick = (orderId) => {
    const selectedOrder = orders.find((order) => order._id === orderId);
    if (selectedOrder) {
      const mealDescriptions = selectedOrder.meals
        .map((meal) => `${meal.mealName}: ${meal.mealQuantity} x ${meal.mealPrice}`)
        .join(", <br/> ");
      setSelectedDescription(mealDescriptions);
    }
    setSelectedOrderId(orderId);
    setIsDescriptionModalOpen(true);
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
              orderDate.setHours(0, 0, 0, 0);
              return orderDate.getTime() === today.getTime();
            })
            .filter((order) => ["Pending", "Ready"].includes(order.mealStatus))
            .map((order) => (
              <tr key={order._id} className="text-center">
                <td className="p-2">{order._id}</td>
                <td className="p-2">
                  <span
                    className={`inline-block w-full px-4 py-2 leading-none ${statusStyles[order.mealStatus] || "bg-gray-200 text-black"} rounded-lg`}
                  >
                    {order.mealStatus}
                  </span>
                </td>
                <td className="p-2">{formatDate(order.meals[0].timestamp)}</td>
                <td className="p-2">{order.canteenName}</td>
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
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsDeleteModalOpen(true);
                    }}
                    className="px-2 py-1 text-white bg-red-500 rounded-xl"
                  >
                    Cancel
                  </button>
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

      
      <DescriptionModel
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        description={selectedDescription}
        orderId={selectedOrderId}
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
