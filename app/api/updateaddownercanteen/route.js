// app/api/updateaddownercanteen/route.js
import Canteen from "@/models/Canteen";
import { connectMongoDB } from "@/lib/mongodb";

export async function PUT(req) {
  try {
    await connectMongoDB();

    // Extract the ID from the query parameters using req.url (since query params are in the URL)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Missing ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the canteen by ID
    const canteen = await Canteen.findById(id);
    if (!canteen) {
      return new Response(
        JSON.stringify({ message: "Canteen not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the status field
    canteen.status = "Active"; // You can adjust this logic if needed
    await canteen.save();

    // Return the updated canteen details
    return new Response(
      JSON.stringify(canteen),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating canteen details:", error);
    return new Response(
      JSON.stringify({ message: "Failed to update canteen details" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
