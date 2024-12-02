import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Cashier from '@/models/Cashier';  // Adjust the path to where your model is located
import { connectMongoDB } from "@/lib/mongodb";


export async function POST(req) {
  const { firstName, lastName, email, image, phoneNumber, nicNumber, password } = await req.json();

  if (!firstName || !lastName || !email || !image || !phoneNumber || !nicNumber || !password) {
    return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
  }

  try {
    await  connectMongoDB();

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new cashier
    const newCashier = new Cashier({
      firstName,
      lastName,
      email,
      image,
      phoneNumber,
      nicNumber,
      password: hashedPassword,
    });

    // Save to database
    await newCashier.save();

    return new Response(
      JSON.stringify({ message: 'Cashier added successfully', cashier: newCashier }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Error adding cashier' }),
      { status: 500 }
    );
  }
}
