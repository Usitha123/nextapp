// app/api/viewownerDetails/route.js
import { connectMongoDB } from '@/lib/mongodb'; // Make sure the MongoDB connection utility is correctly imported
import OwnerDetails from '@/models/OwnerDetails'; // Import the OwnerDetails model

export async function GET(req) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Fetch all owner records from the OwnerDetails collection
    const owners = await OwnerDetails.find(); 

    // Return the list of owner details
    return new Response(JSON.stringify(owners), { status: 200 });
  } catch (error) {
    console.error('Error fetching owner details:', error);
    return new Response('Error fetching owner details', { status: 500 });
  }
}
