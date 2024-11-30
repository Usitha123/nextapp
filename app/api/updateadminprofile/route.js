import Admin from '../../../models/Admin'; // Import the Admin model
import { connectMongoDB } from '@/lib/mongodb';
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing

export async function PUT(req) {
  try {
    // Connect to the database
    await connectMongoDB();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');  // Extract the ID from the query string

    if (!id) {
      return new Response('Missing ID', { status: 400 });
    }

    // Find the admin by ID
    const admin = await Admin.findById(id);
    if (!admin) {
      return new Response('Admin not found', { status: 404 });
    }

    // Get updated data from the request body
    const updatedData = await req.json();

    // If password is included in the update, hash it before updating
    if (updatedData.password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(updatedData.password, salt);
    }

    // Update the admin document
    await admin.updateOne(updatedData);

    return new Response(JSON.stringify(admin), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to update admin', { status: 500 });
  }
}
