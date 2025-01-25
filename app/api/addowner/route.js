// app/api/addowner/route.js

import bcrypt from 'bcryptjs';
import Owner from '@/models/OwnerDetails'; // Adjust the path as needed
import { connectMongoDB } from '@/lib/mongodb';

// Utility function for email validation
const isValidEmail = (email) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
};

export async function POST(req) {
  try {
    const { firstName, lastName, email, status, phoneNumber, nicNumber, selectcanteen, password } = await req.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !status || !phoneNumber || !nicNumber || !selectcanteen || !password) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400 }
      );
    }

    // Validate email format
    if (!email || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing email format' }),
        { status: 400 }
      );
    }

    // Connect to the database
    await connectMongoDB();

    // Check if the owner already exists by email
    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return new Response(
        JSON.stringify({ error: 'Owner with this email already exists' }),
        { status: 409 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new owner document
    const newOwner = new Owner({
      firstName,
      lastName,
      email,
      status: status || 'Active', // Default to 'Active' if status is not provided
      phoneNumber,
      nicNumber,
      selectcanteen,
      password: hashedPassword,
    });

    // Save new owner to the database
    await newOwner.save();

    return new Response(
      JSON.stringify({ message: 'Owner added successfully', owner: newOwner }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding owner:', error);
    if (error.code === 11000) {
      // Duplicate key error for email
      return new Response(
        JSON.stringify({ error: 'Owner with this email already exists' }),
        { status: 409 }
      );
    }
    return new Response(
      JSON.stringify({ error: 'Failed to add owner' }),
      { status: 500 }
    );
  }
}
