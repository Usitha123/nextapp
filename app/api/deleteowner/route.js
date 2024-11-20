// app/api/ownerdetails/delete/route.js
import { connectMongoDB } from '@/lib/mongodb'; // MongoDB connection utility
import OwnerDetails from '@/models/OwnerDetails';
import { ObjectId } from 'mongodb';

export async function DELETE(req) {
  // Get the id from query parameters
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  // Ensure the id is valid
  if (!ObjectId.isValid(id)) {
    return new Response('Invalid ObjectId', { status: 400 });
  }

  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Find and delete the OwnerDetails document by ObjectId
    const deletedOwner = await OwnerDetails.findByIdAndDelete(id);

    // If no document is found with the given ID
    if (!deletedOwner) {
      return new Response('Owner not found', { status: 404 });
    }

    return new Response('Owner details deleted successfully', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
