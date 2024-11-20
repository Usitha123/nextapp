// app/api/deleteuser/route.js
import { connectMongoDB } from '@/lib/mongodb'; // MongoDB connection utility
import Users from '@/models/user';
import { ObjectId } from 'mongodb';

export async function DELETE(req) {
  // Get the id from query parameters
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

    // Find and delete the User document by ObjectId
    const deletedUser = await Users.findByIdAndDelete(id);

    // If no document is found with the given ID
    if (!deletedUser) {
      return new Response('User not found', { status: 404 });
    }

    // Log the deletion for audit purposes
    console.log(`User with ID ${id} deleted successfully`);

    return new Response('User details deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting user details:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
