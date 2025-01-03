// app/api/addorders/route.js
import { connectMongoDB } from "@/lib/mongodb";
import Order from '@/models/Order'; // Import the correct model

export async function POST(request) {
  await connectMongoDB();

  try {
    const body = await request.json();
    
    // Destructure the body to get the user data
    const { userName, userEmail, canteenName, mealType, meals } = body;

    // Validate the meal data structure before creating the order
    if (!Array.isArray(meals) || meals.some(meal => !meal.mealId || !meal.mealName || !meal.mealQuantity || !meal.mealPrice)) {
      return new Response(JSON.stringify({ error: 'Invalid meal data provided' }), {
        status: 400,
      });
    }

    // Create a new order document
    const newOrder = new Order({
      userName,
      userEmail,
      canteenName,
      mealType,
      meals, // an array of meal objects
    });

    // Save the order to the database
    await newOrder.save();

    return new Response(JSON.stringify({ message: 'Order created successfully', order: newOrder }), {
      status: 201,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(JSON.stringify({ error: 'Failed to create order' }), {
      status: 500,
    });
  }
}
