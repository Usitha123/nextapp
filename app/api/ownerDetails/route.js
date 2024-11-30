import { connectMongoDB } from "@/lib/mongodb";
import OwnerDetails from '@/models/OwnerDetails';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    // Parse the incoming JSON body from the request
    const { firstName, lastName, email, image, phoneNumber, nicNumber, password, status, selectcanteen } = await req.json();

    // Validate email field
    if (!email || !email.trim()) {
      return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds set to 10

    // Connect to the database
    await connectMongoDB();

    // Create a new OwnerDetails document
    const newOwner = new OwnerDetails({
      firstName,
      lastName,
      email, // Make sure email is being sent correctly
      image,
      phoneNumber,
      nicNumber,
      password: hashedPassword, // Save the hashed password
      status,
      selectcanteen
    });

    // Save the new owner to the database
    await newOwner.save();

    // Return success response
    return new Response(JSON.stringify({ message: 'Owner details saved successfully', data: newOwner }), { status: 201 });
  } catch (error) {
    console.error('Error creating owner details:', error);
    return new Response(JSON.stringify({ message: 'Failed to create owner details', error: error.message }), { status: 500 });
  }
}
