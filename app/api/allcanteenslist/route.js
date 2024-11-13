// app/api/canteens/route.js

import Canteen from '../../../models/Canteen';
import { connectMongoDB } from '@/lib/mongodb';

export async function GET(req) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Fetch all canteen records
    const canteens = await Canteen.find(); 

    return new Response(JSON.stringify(canteens), { status: 200 });
  } catch (error) {
    return new Response('Error fetching canteens', { status: 500 });
  }
}
