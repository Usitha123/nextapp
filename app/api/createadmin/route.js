// app/api/createadmin/route.js
import { connectMongoDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(request) {
  try {
    const { firstName, lastName, phone, email, nic, password } = await request.json();
    
    // Validation
    if (!firstName || !lastName || !phone || !email || !nic || !password) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'All fields are required',
          message: 'Please provide firstName, lastName, phone, email, nic, and password'
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Additional validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid email format'
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Password must be at least 6 characters long'
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    await connectMongoDB();

    // Check if admin exists by email or NIC
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { nic }] });
    if (existingAdmin) {
      const conflictField = existingAdmin.email === email ? 'email' : 'NIC';
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Admin with this ${conflictField} already exists`
        }), 
        { 
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create new admin (let the schema pre-save hook handle password hashing)
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      phone,
      nic,
      password, // Let the schema pre-save hook hash this
    });

    const savedAdmin = await newAdmin.save();

    // Return success response without password
    const adminResponse = {
      id: savedAdmin._id,
      firstName: savedAdmin.firstName,
      lastName: savedAdmin.lastName,
      email: savedAdmin.email,
      phone: savedAdmin.phone,
      nic: savedAdmin.nic,
      status: savedAdmin.status,
      createdAt: savedAdmin.createdAt
    };

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Admin created successfully',
        admin: adminResponse
      }), 
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Create admin error:', error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Admin with this ${field} already exists`
        }), 
        { 
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        message: error.message
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}