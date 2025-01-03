// app/api/vieworders/route.js
import { connectMongoDB } from "@/lib/mongodb";
import Order from '@/models/Order'; // Import the correct model

export async function GET(request) {
  await connectMongoDB();

  try {
    // Retrieve all orders from the database
    const orders = await Order.find().exec();

    // Check if there are any orders
    if (!orders || orders.length === 0) {
      return new Response(JSON.stringify({ message: 'No orders found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ orders }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
      status: 500,
    });
  }
}
