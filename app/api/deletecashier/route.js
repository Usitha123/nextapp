// app/api/deletecashier/route.js
import { connectMongoDB } from '@/lib/mongodb'; // MongoDB connection utility
import Cashier from '@/models/Cashier'; // Corrected to use the Cashier model
import { ObjectId } from 'mongodb';

export async function DELETE(req) {
  // Get the ID from the URL query parameters
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  // Check if ID is provided
  if (!id) {
    return new Response('ID parameter is missing', { status: 400 });
  }

  // Ensure the id is valid
  if (!ObjectId.isValid(id)) {
    return new Response('Invalid ObjectId format', { status: 400 });
  }

  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Find and delete the Cashier document by ObjectId
    const deletedCashier = await Cashier.findByIdAndDelete(id);

    // If no document is found with the given ID
    if (!deletedCashier) {
      return new Response('Cashier not found', { status: 404 });
    }

    // Log the deletion for audit purposes
    console.log(`Cashier with ID ${id} deleted successfully`);

    return new Response('Cashier details deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting cashier details:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
