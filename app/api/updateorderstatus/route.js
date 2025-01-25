import Order from "@/models/Order";
import { connectMongoDB } from "@/lib/mongodb";

export async function PUT(req) {
  try {
    await connectMongoDB();

    // Extract the ID from the query parameters using req.url (since query params are in the URL)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id')?.trim();


    if (!id) {
      return new Response(
        JSON.stringify({ message: "Missing ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse the request body
    const { orderStatus } = await req.json();
    if (!orderStatus) {
      return new Response(
        JSON.stringify({ message: "Missing status in the request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the order by ID
    const order = await Order.findById(id);
    if (!order) {
      return new Response(
        JSON.stringify({ message: "Order not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the status field
    order.orderStatus = orderStatus;
    await order.save();

    // Return the updated order details
    return new Response(
      JSON.stringify(order), // Return the updated order object
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating order details:", error);
    return new Response(
      JSON.stringify({ message: "Failed to update order details" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
