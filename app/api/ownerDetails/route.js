// app/api/ownerDetails/route.js
import { connectMongoDB } from "@/lib/mongodb";  // Utility to connect to MongoDB
import OwnerDetails from '@/models/OwnerDetails'; // The OwnerDetails model

export async function POST(req) {
  try {
    const { firstName, lastName, ownerEmail, image, phoneNumber, nicNumber, password, confirmPassword, status, selectcanteen } = await req.json();

    // Check if the passwords match
    if (password !== confirmPassword) {
      return new Response(JSON.stringify({ message: 'Passwords do not match' }), { status: 400 });
    }

    // Connect to the database
    await connectMongoDB();

    // Create a new OwnerDetails document
    const newOwner = new OwnerDetails({
      firstName,
      lastName,
      ownerEmail,
      image,
      phoneNumber,
      nicNumber,
      password,
      confirmPassword, // Store confirmPassword, but in a real app, you should not store it in the DB
      status,
      selectcanteen
    });

    // Save the new owner to the database
    await newOwner.save();

    return new Response(JSON.stringify({ message: 'Owner details saved successfully', data: newOwner }), { status: 201 });
  } catch (error) {
    console.error('Error creating owner details:', error);
    return new Response(JSON.stringify({ message: 'Failed to create owner details', error: error.message }), { status: 500 });
  }
}
