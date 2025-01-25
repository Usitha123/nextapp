// app/api/allmeallist/route.js
import Meal from '@/models/Meal';
import { connectMongoDB } from '@/lib/mongodb';

export async function GET(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id')?.trim();

    if (!id) {
      const meals = await Meal.find();
      return new Response(JSON.stringify(meals), { status: 200 });
    }

    const meal = await Meal.findById(id);
    if (!meal) {
      return new Response('Meal not found', { status: 404 });
    }

    return new Response(JSON.stringify(meal), { status: 200 });
  } catch (error) {
    return new Response('Error fetching meals details', { status: 500 });
  }
}
