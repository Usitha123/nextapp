// app/api/deletemeal/route.js
import mongoose from 'mongoose';
import Meal from '@/models/Meal'; // Ensure correct model import
import { connectMongoDB } from '@/lib/mongodb'; // MongoDB connection utility

export async function DELETE(req) {
  const { searchParams } = new URL(req.url); 
  const id = searchParams.get('id'); // Extract the 'id' query parameter

  // Connect to MongoDB
  await connectMongoDB();

  try {
    // Validate the ID format
    if (!mongoose.isValidObjectId(id)) {
      return new Response(JSON.stringify({ message: 'Invalid ID format' }), { status: 400 });
    }

    // Attempt to find and delete the meal by ID
    const meal = await Meal.findByIdAndDelete(id);

    if (!meal) {
      return new Response(JSON.stringify({ message: 'Meal not found' }), { status: 404 });
    }

    // Respond with success
    return new Response(JSON.stringify({ message: 'Meal deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting meal:', error);
    return new Response(JSON.stringify({ message: 'Error deleting meal' }), { status: 500 });
  }
}
