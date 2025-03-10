import OwnerDetails from "@/models/OwnerDetails";
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


    // Parse the request body
    const { status } = await req.json();
    if (!status) {
      return new Response(
        JSON.stringify({ message: "Missing status in the request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the owner by ID
    const owner = await OwnerDetails.findById(id);
    if (!owner) {
      return new Response(
        JSON.stringify({ message: "Owner not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the status field
    owner.status = status;
    await owner.save();

    // Return the updated owner details
    return new Response(
      JSON.stringify(owner),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating owner details:", error);
    return new Response(
      JSON.stringify({ message: "Failed to update owner details" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
