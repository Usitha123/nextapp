// app/api/deleteorder/route.js
import mongoose from 'mongoose';
import Order from '@/models/Order'; // Ensure correct model import
import { connectMongoDB } from '@/lib/mongodb'; // MongoDB connection utility

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id'); // Extract the 'id' query parameter

  // Validate the presence of 'id' parameter
  if (!id) {
    return new Response(JSON.stringify({ message: 'ID parameter is required' }), { status: 400 });
  }

  // Connect to MongoDB
  await connectMongoDB();

  try {
    // Validate the ID format
    if (!mongoose.isValidObjectId(id)) {
      return new Response(JSON.stringify({ message: 'Invalid ID format' }), { status: 400 });
    }

    // Attempt to find and delete the order by ID
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return new Response(JSON.stringify({ message: 'Order not found' }), { status: 404 });
    }

    // Respond with success
    return new Response(JSON.stringify({ message: 'Order deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting order:', error);
    return new Response(JSON.stringify({ message: 'Error deleting order', error: error.message }), { status: 500 });
  }
}
