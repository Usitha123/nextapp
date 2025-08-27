import bcrypt from 'bcryptjs';
import { connectMongoDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(request) {
  try {
    const { firstName, lastName, phone, email, nic, password } = await request.json();

    // Check for missing fields
    if (!firstName || !lastName || !phone || !email || !nic || !password) {
      return new Response('All fields are required', { status: 400 });
    }

    await connectMongoDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { nic }] });
    if (existingAdmin) {
      return new Response('Admin with this email or NIC already exists', { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new Admin({
      firstName,
      lastName,
      phone,
      email,
      nic,
      password: hashedPassword,
    });

    await newAdmin.save();

    return new Response(JSON.stringify({ message: 'Admin added successfully' }), { status: 201 });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
