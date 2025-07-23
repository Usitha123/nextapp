import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import UpdateStatusModal from "./Deleteorder";
import DescriptionModal from "./Descriptionmodel";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { data: session } = useSession();
  const pathname = usePathname();

  // Add refreshTrigger as a dependency to refetch when it changes
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
      
      // Successful status update
      alert(`Status updated to ${status}`);
      
      // Force a fresh fetch instead of modifying state locally
      setRefreshTrigger(prev => prev + 1);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status");
    }
  };

  const formatDate = (dateString) => {
    try {
      const createdAt = new Date(dateString);
      return createdAt.toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const handleDescriptionClick = (orderId) => {
    const order = orders.find((order) => order._id === orderId);
    if (order) {
      const mealDescriptions = order.meals
        .map((meal) => `${meal.mealName}: ${meal.mealQuantity} x ${meal.mealPrice}`)
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

  const getFilteredOrders = () => {
    if (!orders || !orders.length || !session?.user?.email) {
      return [];
    }

    return orders
      .filter((order) => session.user.email === order.userEmail)
      .filter((order) => 
        Array.isArray(order.meals) && 
        order.meals.length > 0 && 
        ["Pending", "Ready", "Accepted"].includes(order.orderStatus)
      );
  };

  const renderOrdersTable = () => {
    const filteredOrders = getFilteredOrders();
    
    if (filteredOrders.length === 0) {
      return <p>No active orders available</p>;
    }

    return (
      
        <div className="overflow-auto justify-center min-w-[0px] max-w-[75vw] lg:max-w-full rounded-xl">
    <table className="min-w-[20px] w-full text-sm bg-white rounded-2xl">
      
      {/* <table className="px-2 overflow-auto max-h-[80vh] w-full p-3 bg-white rounded-2xl"> */}
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
          {filteredOrders.map((order) => (
            <tr key={order._id} className="text-center">
              <td className="p-2">{order._id}</td>
              <td className="p-2">
                <span className="inline-block w-[60%] px-4 py-2 leading-none text-white bg-green-500 rounded-xl">
                  {order.orderStatus}
                </span>
              </td>
              <td className="p-2">
                {order.meals && order.meals[0] && order.meals[0].timestamp
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
                  className="inline-block w-[60%] px-4 py-2 leading-none text-white bg-red-500 rounded-xl"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
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