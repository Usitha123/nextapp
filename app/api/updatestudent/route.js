import Student from '@/models/Student'; // Ensure the correct path to your model
import { connectMongoDB } from '@/lib/mongodb';

export async function PUT(req) {
  try {
    // Connect to the MongoDB database
    await connectMongoDB();

    // Extract 'id' from query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Check if 'id' is provided
    if (!id) {
      return new Response('Missing ID', { status: 400 });
    }

    // Find the student by the provided ID
    const student = await Student.findById(id);
    if (!student) {
      return new Response('Student not found', { status: 404 });
    }

    // Parse the request body for updated data
    const updatedData = await req.json();

    // Update the student record
    await student.updateOne(updatedData);

    // Return the updated student record
    return new Response(JSON.stringify(student), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to update Student', { status: 500 });
  }
}
