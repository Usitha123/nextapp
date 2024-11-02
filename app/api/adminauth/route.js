// pages/api/auth/adminauth.js

import { connectMongoDB } from "@/lib/mongodb";

export default async function handler(req, res) {
  await connectMongoDB();

  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // Find admin by email
      const admin = await Admin.findOne({ email });

      // Check if admin exists and password matches
      if (admin && admin.password === password) {
        return res.status(200).json({ message: 'Login successful', admin });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
