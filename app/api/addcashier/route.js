import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Cashier from '@/models/Cashier'; // Adjust the path as needed
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { firstName, lastName, email, image, phoneNumber, nicNumber, password, selectCanteen } = await req.json();

    if (!firstName || !lastName || !email || !image || !phoneNumber || !nicNumber || !password) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400 }
      );
    }

    await connectMongoDB();

    const existingCashier = await Cashier.findOne({ email });
    if (existingCashier) {
      return new Response(
        JSON.stringify({ error: 'Cashier with this email already exists' }),
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCashier = new Cashier({
      firstName,
      lastName,
      email,
      image,
      phoneNumber,
      nicNumber,
      password: hashedPassword,
      selectCanteen,
    });

    await newCashier.save();

    return new Response(
      JSON.stringify({ message: 'Cashier added successfully', cashier: newCashier }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding cashier:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to add cashier' }),
      { status: 500 }
    );
  }
}
