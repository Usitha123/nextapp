import { connectMongoDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing

export async function PUT(req) {
  try {
    await connectMongoDB();

    const updatedData = await req.json();
    
    // Extract the password from the update data if present
    if (updatedData.password) {
      // Hash the new password before saving
      const hashedPassword = await bcrypt.hash(updatedData.password, 10);
      updatedData.password = hashedPassword; // Replace plain password with hashed one
    }

    // Assuming you're updating the admin by email or another identifier
    const { email } = updatedData;
    if (!email) {
      return new Response('Email is required to identify the admin.', { status: 400 });
    }

    // Update the admin document by email or another identifier
    const admin = await Admin.findOneAndUpdate({ email }, updatedData, { new: true });
    if (!admin) {
      return new Response('No admin details found to update', { status: 404 });
    }

    return new Response(JSON.stringify(admin), { status: 200 });
  } catch (error) {
    console.error('Error updating admin details:', error);
    return new Response('Error updating admin details', { status: 500 });
  }
}
