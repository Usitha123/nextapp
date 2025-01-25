// app/api/updatemeal/route.js
import Meal from '@/models/Meal';
import { connectMongoDB } from '@/lib/mongodb';

export async function PUT(req) {
    try {
      await connectMongoDB();
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id')?.trim();
  
      if (!id) {
        return new Response('Missing ID', { status: 400 });
      }
  
      const meal = await Meal.findById(id);
      if (!meal) {
        return new Response('Meal not found', { status: 404 });
      }
  
      const updatedData = await req.json();
      
      // Validate or sanitize the updatedData here if needed
      // For example: if (updatedData.mealPrice < 0) {...}
  
      // Update the meal document
      const result = await meal.updateOne(updatedData);
      
      if (result.nModified === 0) {
        return new Response('No changes made', { status: 400 });
      }
  
      // Retrieve the updated meal document
      const updatedMeal = await Meal.findById(id);
      
      return new Response(JSON.stringify(updatedMeal), { status: 200 });
  
    } catch (error) {
      console.error('Error updating meal:', error); // Log the error for debugging
      return new Response('Failed to update Meal: ' + error.message, { status: 500 });
    }
  }
  
