import { connectMongoDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(req) {
  try {
    // Connect to the database
    await connectMongoDB();

    // Get data from the request body
    const { firstName, lastName, phone, email, nic, password } = await req.json();

    // Validate input
    if (!firstName || !lastName || !phone || !email || !nic || !password) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
    }

    // Check if the email or NIC is already taken
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { nic }] });
    if (existingAdmin) {
      return new Response(
        JSON.stringify({ error: existingAdmin.email === email ? 'Email already exists' : 'NIC already exists' }),
        { status: 400 }
      );
    }

    // Basic password validation (optional, can be customized)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters long and contain at least one letter and one number.' }),
        { status: 400 }
      );
    }

    // Create a new Admin record
    const newAdmin = new Admin({
      firstName,
      lastName,
      phone,
      email,
      nic, 
      password,
    });

    // Save the new Admin to the database
    await newAdmin.save();

    // Respond with the created Admin object (excluding the password)
    const adminResponse = { ...newAdmin.toObject() };
    delete adminResponse.password;

    return new Response(JSON.stringify(adminResponse), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
