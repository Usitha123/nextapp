import bcrypt from "bcryptjs";
import Owner from "@/models/OwnerDetails";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const {
      firstName,
      lastName,
      email,
      image,
      phoneNumber,
      nicNumber,
      selectcanteen,
      password,
    } = await req.json();

    // Validate all required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !image ||
      !phoneNumber ||
      !nicNumber ||
      !selectcanteen ||
      !password
    ) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Connect to the database
    await connectMongoDB();

    // Check for existing owner by email
    const existingOwner = await Owner.findOne({ email: email });
    if (existingOwner) {
      return new Response(
        JSON.stringify({ error: "An owner with this email already exists." }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new owner
    const newOwner = new Owner({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      image: image,
      phoneNumber: phoneNumber.trim(),
      nicNumber: nicNumber.trim(),
      selectcanteen: selectcanteen,
      password: hashedPassword,
    });

    await newOwner.save();

    return new Response(
      JSON.stringify({
        message: "Owner added successfully.",
        owner: newOwner
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error adding owner:", error);
    return new Response(
      JSON.stringify({ error: "Failed to add owner." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}