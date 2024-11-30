// app/api/viewAdminDetails/route.js
import { connectMongoDB } from '@/lib/mongodb'; // Make sure the MongoDB connection utility is correctly imported
import Admin from '@/models/Admin'; // Import the Admin model

export async function GET(req) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Fetch all admin records from the Admin collection
    const admins = await Admin.find(); 

    // Return the list of admin details
    return new Response(JSON.stringify(admins), { status: 200 });
  } catch (error) {
    console.error('Error fetching admin details:', error);
    return new Response('Error fetching admin details', { status: 500 });
  }
}
