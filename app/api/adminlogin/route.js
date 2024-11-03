import { connectMongoDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function POST(req) {
  try {
    await connectMongoDB(); // Connect to the database

    const { email, password } = await req.json(); // Extract email and password

    // Validate input
    if (!email || !password) {
      return new Response('Email and password are required', { status: 400 });
    }

    // Find the admin by email
    const admin = await Admin.findOne({ email });

    // Check if the admin exists and if the password matches
    // Consider implementing password hashing for better security
    if (!admin || admin.password !== password) {
      return new Response('Invalid credentials', { status: 401 });
    }

    // Handle successful login (set session or token here if needed)
    return new Response(JSON.stringify({ message: 'Login successful', admin }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('An error occurred during login', { status: 500 });
  }
}
