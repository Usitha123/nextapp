import bcrypt from 'bcrypt'; // Import bcrypt for hashing
import { connectMongoDB } from '@/lib/mongodb'; // Adjust the path as needed
import Admin from '@/models/Admin'; // Adjust the path as needed

export async function POST(request) {
  try {
    const { firstName, lastName, phone, email, nic, password } = await request.json();
    
    if (!firstName || !lastName || !phone || !email || !nic || !password) {
      return new Response('All fields are required', { status: 400 });
    }

    // Connect to MongoDB
    await connectMongoDB();

    // Check if the admin with the given email or NIC already exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { nic }] });
    if (existingAdmin) {
      return new Response('Admin with this email or NIC already exists', { status: 400 });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds for bcrypt

    // Create a new admin object
    const newAdmin = new Admin({
      firstName,
      lastName,
      phone,
      email,
      nic,
      password: hashedPassword, // Store the hashed password
    });

    // Save the new admin to the database
    await newAdmin.save();

    return new Response(JSON.stringify({ message: 'Admin added successfully' }), { status: 201 });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
