import { connectMongoDB } from '@/lib/mongodb'; // Adjust the path as needed
import Admin from '@/models/Admin'; // Adjust the path as needed

export async function POST(request) {
  try {
    const { firstName, lastName, phone, email, nic, password } = await request.json();
    
    if (!firstName || !lastName || !phone || !email || !nic || !password) {
      return new Response('All fields are required', { status: 400 });
    }

    await connectDb();

    const existingAdmin = await Admin.findOne({ $or: [{ email }, { nic }] });
    if (existingAdmin) {
      return new Response('Admin with this email or NIC already exists', { status: 400 });
    }

    const newAdmin = new Admin({
      firstName,
      lastName,
      phone,
      email,
      nic,
      password,
    });

    await newAdmin.save();

    return new Response(JSON.stringify({ message: 'Admin added successfully' }), { status: 201 });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}