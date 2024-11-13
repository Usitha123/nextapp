import Canteen from '../../../models/Canteen';
import { connectMongoDB } from '@/lib/mongodb';

export async function POST(req) {
  try {
    // Parse the request body
    const { canteenName, businessEmail, openHour, closedHour, phoneNumber, image, status, openingDate, ownerstatus } = await req.json();

    // Connect to MongoDB
    await connectMongoDB();

    // Ensure `openingDate` is properly parsed as a Date object
    const openingDateObj = new Date(openingDate);
    if (isNaN(openingDateObj.getTime())) {
      return new Response(JSON.stringify({ message: 'Invalid opening date format' }), { status: 400 });
    }

    // Create the new canteen document
    const newCanteen = new Canteen({
      canteenName,
      businessEmail,
      openHour,
      closedHour,
      phoneNumber,
      image,
      status,
      openingDate: openingDateObj, // Store as a Date object
      ownerstatus: ownerstatus || 'Inactive', // Default to 'Inactive' if not provided
    });

    // Save the new canteen
    await newCanteen.save();

    return new Response(JSON.stringify({ message: 'Canteen added successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error adding canteen:', error);

    // Check if the error is a validation error
    if (error.name === 'ValidationError') {
      return new Response(JSON.stringify({ message: 'Validation failed', errors: error.errors }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: 'Error adding canteen', error: error.message }), { status: 500 });
  }
}
