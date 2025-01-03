
import Cashiers from '@/models/Cashier';
import { connectMongoDB } from '@/lib/mongodb';

export async function GET(req) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Fetch all canteen records
    const cashiers = await Cashiers.find(); 

    return new Response(JSON.stringify(cashiers), { status: 200 });
  } catch (error) {
    return new Response('Error fetching cashiers', { status: 500 });
  }
}
