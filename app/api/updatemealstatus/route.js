import mongoose from 'mongoose';
import Meal from '@/models/Meal'; // Ensure correct model import
import { connectMongoDB } from '@/lib/mongodb'; // MongoDB connection utility

export async function PATCH(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id'); // Extract the 'id' query parameter
  const { status } = await req.json(); // Extract the new status from the request body

  // Connect to MongoDB
  await connectMongoDB();

  try {
    // Validate the ID format
    if (!mongoose.isValidObjectId(id)) {
      return new Response(JSON.stringify({ message: 'Invalid ID format' }), { status: 400 });
    }

    // Attempt to find and update the meal status by ID
    const meal = await Meal.findByIdAndUpdate(
      id,
      { mealstatus: status }, // Update the status field
      { new: true } // Return the updated document
    );

    if (!meal) {
      return new Response(JSON.stringify({ message: 'Meal not found' }), { status: 404 });
    }

    // Respond with success
    return new Response(JSON.stringify({ message: 'Meal status updated successfully', meal }), { status: 200 });
  } catch (error) {
    console.error('Error updating meal status:', error);
    return new Response(JSON.stringify({ message: 'Error updating meal status' }), { status: 500 });
  }
}
