import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { firstName, lastName, email, password, faculty, phoneNumber } = await req.json();

    // Check for required fields
    if (!firstName || !lastName || !email || !password || !faculty || !phoneNumber) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format." }, { status: 400 });
    }

    await connectMongoDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists." }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with status as 'active' (timestamps are handled by Mongoose automatically)
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      faculty,
      phoneNumber,
      status: 'active', // Default status is active
     
    });

    return NextResponse.json({ message: "User registered successfully.", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
