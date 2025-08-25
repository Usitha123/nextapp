
import Admins from '@/models/Admin';
import { connectMongoDB } from '@/lib/mongodb';

export async function GET(req) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Fetch all canteen records
    const admins = await Admins.find(); 

    return new Response(JSON.stringify(admins), { status: 200 });
  } catch (error) {
    return new Response('Error fetching admins', { status: 500 });
  }
}
