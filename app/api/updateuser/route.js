import User from '@/models/user';
import { connectMongoDB } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';  // Import bcryptjs

export async function PUT(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id')?.trim();

    if (!id) {
      return new Response('Missing ID', { status: 400 });
    }

    const user = await User.findById(id);
    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    const updatedData = await req.json();

    // If the password is being updated, hash it
    if (updatedData.password) {
      const salt = await bcrypt.genSalt(10); // Generate salt with rounds of 10
      updatedData.password = await bcrypt.hash(updatedData.password, salt); // Hash the password
    }

    // Update the user document with the new data
    const result = await user.updateOne(updatedData);

    if (result.nModified === 0) {
      return new Response('No changes made', { status: 400 });
    }

    // Retrieve the updated user document
    const updatedUser = await User.findById(id);

    return new Response(JSON.stringify(updatedUser), { status: 200 });

  } catch (error) {
    console.error('Error updating user:', error); // Log the error for debugging
    return new Response('Failed to update User: ' + error.message, { status: 500 });
  }
}
