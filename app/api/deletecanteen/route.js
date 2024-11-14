// app/api/deletecanteen/route.js
import mongoose from 'mongoose';
import Canteen from '@/models/Canteen'; // Adjust the path according to your project structure
import { connectMongoDB } from '@/lib/mongodb'; // MongoDB connection utility

export async function DELETE(req) {
  const { searchParams } = new URL(req.url); 
  const id = searchParams.get('id'); // Get the 'id' query parameter from the URL

  // Connect to MongoDB
  await connectMongoDB();

  try {
    // Check if the ID is valid
    if (!mongoose.isValidObjectId(id)) {
      return new Response(JSON.stringify({ message: 'Invalid ID format' }), { status: 400 });
    }

    // Attempt to delete the canteen by ID
    const canteen = await Canteen.findByIdAndDelete(id);

    if (!canteen) {
      return new Response(JSON.stringify({ message: 'Canteen not found' }), { status: 404 });
    }

    // Return a success response
    return new Response(JSON.stringify({ message: 'Canteen deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Error deleting canteen' }), { status: 500 });
  }
}
