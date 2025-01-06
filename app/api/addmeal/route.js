import { connectMongoDB } from "@/lib/mongodb";
import Meal from '@/models/Meal';

export async function POST(req) {
  try {
    // Connect to the database
    await connectMongoDB();

    // Parse the request body
    const body = await req.json();

    // Validate required fields
    const requiredFields = ['mealName', 'mealDescription', 'mealPrice', 'mealType', 'mealQuantity', 'selectCanteen', 'image'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return new Response(JSON.stringify({ success: false, error: `${field} is required.` }), { status: 400 });
      }
    }

    // Create a new Meal instance
    const newMeal = new Meal(body);

    // Save the meal to the database
    await newMeal.save();

    // Respond with the newly created meal
    return new Response(JSON.stringify({ success: true, data: newMeal }), { status: 201 });
  } catch (error) {
    console.error('Error adding meal:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
