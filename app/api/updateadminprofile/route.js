// app/api/updateAdminDetails/route.js
import { connectMongoDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function PUT(req) {
  try {
    await connectMongoDB();

    const updatedData = await req.json();

    // Update the single admin document
    const admin = await Admin.findOneAndUpdate({}, updatedData, { new: true });
    if (!admin) {
      return new Response('No admin details found to update', { status: 404 });
    }

    return new Response(JSON.stringify(admin), { status: 200 });
  } catch (error) {
    console.error('Error updating admin details:', error);
    return new Response('Error updating admin details', { status: 500 });
  }
}
