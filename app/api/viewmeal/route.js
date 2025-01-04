import { connectMongoDB } from "@/lib/mongodb";
import Meal from "@/models/Meal";

export async function GET(req, res) {
  try {
    // Connect to the database
    await connectMongoDB();

    // Fetch all meals from the database
    const meals = await Meal.find();

    // Respond with the meals
    return new Response(JSON.stringify({ success: true, meals }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching meals:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
