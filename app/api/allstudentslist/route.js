
import Students from '../../../models/user';
import { connectMongoDB } from '@/lib/mongodb';

export async function GET(req) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Fetch all canteen records
    const students = await Students.find(); 

    return new Response(JSON.stringify(students), { status: 200 });
  } catch (error) {
    return new Response('Error fetching students', { status: 500 });
  }
}
