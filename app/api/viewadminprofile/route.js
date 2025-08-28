// app/api/viewadminprofile/route.js
import { connectMongoDB } from '@/lib/mongodb'; // MongoDB connection utility
import Admin from '@/models/Admin'; // Admin model

export async function GET() {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Fetch the single admin document
    const admin = await Admin.find(); // Assumes the collection has only one document 

    // Return the admin document
    return new Response(JSON.stringify(admin), { status: 200 });
  } catch (error) {
    console.error('Error fetching admin details:', error);
    return new Response('Error fetching admin details', { status: 500 });
  }
}
