// app/api/updatestatuscashier/route.js
import Cashier from "@/models/Cashier";
import { connectMongoDB } from "@/lib/mongodb";

export async function PUT(req) {
  try {
    await connectMongoDB();

    // Extract the ID from the query parameters using req.url (since query params are in the URL)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id')?.trim();

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Missing ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse the request body
    const { status } = await req.json();
    if (!status) {
      return new Response(
        JSON.stringify({ message: "Missing status in the request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the owner by ID
    const cashier = await Cashier.findById(id);
    if (!cashier) {
      return new Response(
        JSON.stringify({ message: "Cashier not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the status field
    cashier.status = status;
    await cashier.save();

    // Return the updated user details
    return new Response(
      JSON.stringify(cashier),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating cashier details:", error);
    return new Response(
      JSON.stringify({ message: "Failed to update cashier details" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
