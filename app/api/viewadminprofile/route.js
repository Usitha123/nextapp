// app/api/viewAdminDetails/route.js
import { connectMongoDB } from '@/lib/mongodb'; // MongoDB connection utility
import Admin from '@/models/Admin'; // Admin model

export async function GET() {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Fetch the single admin document
    const admin = await Admin.findOne(); // Assumes the collection has only one document
    if (!admin) {
      return new Response('No admin details found', { status: 404 });
    }

    // Return the admin document
    return new Response(JSON.stringify(admin), { status: 200 });
  } catch (error) {
    console.error('Error fetching admin details:', error);
    return new Response('Error fetching admin details', { status: 500 });
  }
}
